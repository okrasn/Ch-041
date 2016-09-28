angular.module('rssreader').service('feedsService', ['$http', '$state', '$q', 'authService', 'dashboardService', function ($http, $state, $q, authService, dashboardService) {
	that = this;
	this.feedsDictionary = [];
	this.favouritesDictionary = [];
	this.advicedDictionary = [];
	this.advicedFeeds = [];
	this.allArticles = [];
	this.CATEGORIES = ["News", "IT", "Sport", "Design", "Movies", "Music", "Culture", "Nature", "Gaming", "Food", "Economics", "Science"];
	this.allCategories = function () {
		var res = that.CATEGORIES.concat(getCustomCategories());
		res.push("Custom");
		return res;
	}
	this.allFavsCategories = function () {
		var res = that.CATEGORIES.concat(getFavsCustomCategories());
		res.push("Custom");
		return res;
	}
	var getCustomCategories = function () {
		var currentFeedsCats = (function () {
			var res = [];
			for (var i = 0; i < that.feedsDictionary.length; i++) {
				res.push(that.feedsDictionary[i].category);
			}
			return res;
		})();
		return currentFeedsCats.filter(function (elem, i, array) {
			return that.CATEGORIES.indexOf(elem) == -1;
		});
	}

	var getFavsCustomCategories = function () {
		var currentFeedsCats = (function () {
			var res = [];
			for (var i = 0; i < that.favouritesDictionary.length; i++) {
				res.push(that.favouritesDictionary[i].category);
			}
			return res;
		})();
		return currentFeedsCats.filter(function (elem, i, array) {
			return (that.CATEGORIES.indexOf(elem) == -1 && elem != 'Unsorted');
		});
	}

	this.getAll = function () {
		return that.getAllFeeds().then(function (res) {
			return that.getAllFavourites();
		}, function (err) {
			console.log(err);
		});
	}

	this.getAllFeeds = function () {
		return $http.get("/feeds").then(function (res) {
			for (var i = 0; i < res.data.length; i++) {
				for (var j = 0; j < res.data[i].feeds.length; j++) {
					res.data[i].feeds[j].category = res.data[i].category;
				}
			}
			angular.copy(res.data, that.feedsDictionary);
			return res;
		}, function (err) {
			console.log(err);
		});
	}

	this.getSingleFeed = function (id) {
		return $http.get("/getSingleFeed/" + id).success(function (res) {
			return res;
		}).error(function (err) {
			return err;
		});
	}

	this.getAllFavourites = function () {
		return $http.get("/favourites").then(function (res) {
			for (var i = 0; i < res.data.length; i++) {
				for (var j = 0; j < res.data[i].articles.length; j++) {
					res.data[i].articles[j].category = res.data[i].category;
				}
			}
			angular.copy(res.data, that.favouritesDictionary);
			return res;
		}, function (err) {
			console.log(err);
		});
	}

	this.getAdvicedFeeds = function () {
		dashboardService.displayLoading();
		return $http.get("/advicedFeeds").then(function (res) {
			angular.copy(res.data, that.advicedDictionary);
			dashboardService.hideLoading();
		}, function (err) {
			console.log(err);
		});
	}

	this.switchCategory = function () {
		return $http.post('/changeFeedCategory', changeCatObj).success(function (res) {
			$state.go('dashboard.' + dashboardService.getViewMode(), { type: 'all' }, { reload: true });
		}).error(function (err) {
			console.log(err);
		});
	}

	var checkRssFormat = function (xmlDoc) {
		//Determine if RSS
		if (xmlDoc.getElementsByTagName('rss').length) {
			return 'RSS';
			//Determine if ATOM
		} else if (xmlDoc.getElementsByTagName('feed').length) {
			return 'ATOM';
		}
		return -1;
	}
	var generateFeed = function (doc, feed, format) {
		var feedObj = {};
		if (format === 'RSS') {
			var channel = doc.getElementsByTagName('channel')[0];
			feedObj.title = channel.getElementsByTagName('title')[0].childNodes[0].nodeValue;
			feedObj.description = channel.getElementsByTagName('description')[0].childNodes[0] ? channel.getElementsByTagName('description')[0].childNodes[0].nodeValue : '';
			feedObj.link = channel.getElementsByTagName("link")[0].childNodes[0].nodeValue;
			feedObj.rsslink = feed.link;
			feedObj.category = feed.category;
		} else if (format === 'ATOM') {
			feedObj.title = doc.getElementsByTagName('title')[0].childNodes[0].nodeValue;
			feedObj.description = '';
			feedObj.link = doc.getElementsByTagName('link')[0].getAttribute('href');
			feedObj.rsslink = feed.link;
			feedObj.category = feed.category;
		}
		feedObj.format = format;
		return feedObj;
	}
	this.getFeedGenerator = function () {
		return generateFeed;
	}
	this.getRssChecker = function () {
		return checkRssFormat;
	}
	this.addFeed = function (feed) {
		dashboardService.displayLoading();
		return $http.jsonp("https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&q=" + encodeURIComponent(feed.link) + "&method=JSON&callback=JSON_CALLBACK&output=xml")
			.then(function (response) {
					if (feed.link === undefined) {
						return $q.reject("Enter Rss feed link");
					}
					if (feed.category === undefined) {
						return $q.reject("Choose category");
					}
					if (response.data.responseData === null) {
						return $q.reject("URL is incorrect or does not contain RSS Feed data");
					}
					var parser = new DOMParser();
					xmlDoc = parser.parseFromString(response.data.responseData.xmlString, "text/xml");
					var format = checkRssFormat(xmlDoc);
					if (format === -1) {
						return $q.reject("URL is incorrect or does not contain RSS Feed data");
					} else {
						var feedObj = generateFeed(xmlDoc, feed, format);
						return $http.post("/addFeed", feedObj).success(function (res) {
							dashboardService.hideLoading();
							return res;
						}).error(function (err) {
							console.log(err);
							dashboardService.hideLoading();
						});
					}
				return response.data;
			});
	}

	this.removeFeed = function () {
		return $http.delete("/deleteFeed/" + dashboardService.getFeed()._id).then(function (res) {
		}, function (err) {
			console.log(err);
		});
	}

	this.setFeedsOrder = function () {
		var obj = {
			newCategories: []
		}
		for (var i = 0; i < that.feedsDictionary.length; i++) {
			obj.newCategories.push(that.feedsDictionary[i].category);
		}
		return $http.post("/setCategoryOrder", obj);
	}

	this.setInnerFeedsOrder = function () {
		var targetDict = [],
			k = 0;
		for (var i = 0, array = that.feedsDictionary; i < array.length; i++) {
			if (!array[i].feeds.length) {
				continue;
			}
			targetDict.push({
				category: array[i].category,
				feeds: []
			});
			for (var j = 0; j < array[i].feeds.length; j++) {
				targetDict[k].feeds.push(array[i].feeds[j]._id);
			}
			k++;
		}
//	    console.log(targetDict);
		//var iterator = 0;
		//angular.forEach(that.feedsDictionary, function (value, key) {
		//    targetDict.push(value);
		//	angular.forEach(targetDict[key], function (value, key) {
		//	    targetDict[iterator].feeds.push(value);
		//	});
		//	iterator++;
		//});
		console.log(targetDict);
		return $http.post("/setFeedsOrder", targetDict);
	}

	this.setFavsOrder = function () {
		var obj = {
			newCategories: []
		}
		for (var i = 0; i < that.favouritesDictionary.length; i++) {
			obj.newCategories.push(that.favouritesDictionary[i].category);
		}
		return $http.post("/setFavsCategoryOrder", obj);
	}
}]);

function FeedsToJson(array) {
	var Jsonfriendly = [];
	for (var i = 0; i < array.length; i++) {
		var temp = {};
		angular.copy(array[i], temp);
		Jsonfriendly.push(temp);
		delete Jsonfriendly[i]._id;
		for (var j = 0; j < Jsonfriendly[i].feeds.length; j++) {
			delete Jsonfriendly[i].feeds[j].currentSubscriptions;
			delete Jsonfriendly[i].feeds[j].totalSubscriptions;
			delete Jsonfriendly[i].feeds[j].__v;
			delete Jsonfriendly[i].feeds[j].category;
		}
	}
}