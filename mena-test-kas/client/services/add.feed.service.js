angular.module('add.service',[])
    .factory('add.feed.service',[function(){
        var transferArray = [];
        function setArray(array){
            transferArray = array;
        }
        function getArray(){
            return transferArray;
        }
        console.log(transferArray);
        return{
            setArray : setArray,
            getArray : getArray
        }
    }]);
