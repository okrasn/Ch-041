angular.module('add_service')
    .factory('add_feed_service',[function(){
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
