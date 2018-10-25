# "RSS READER"

This is fully functional RSS feed reader with enhanced abilities, including:

- adding feeds with different rss formats (RSS and ATOM)
- grouping feeds by categories
- saving articles as favourites
- social media login and sharing
- and more

#### Basic application deployment
1. Install [NodeJs](https://nodejs.org/en/) (v4 or above)
2. Run next command via __cmd__ in project folder
```
$ npm start
```
3. Visit __localhost:8080__ in your browser

##### Building our front-end with GULP
To generate optimized form of front-end part of our app we are using __Gulp__ task runner.
Gulp tasks can be found in the following table:

| Tasks        | Porpose           | Useage  |
| ------------- |:-------------:| -----:|
| sass| compile sass styles | gulp sass |
| scripts      | concats and minifies all scripts in ./client/js |   gulp scripts |
| main | watch for changes in *.sass and *.js files and performs above tasks|    gulp main |
| build | concats all libraries from __bower_components__ and js files into one minified file, same for styles, optimizes our __index.html__ | gulp build |
| server | runs server | gulp server |


