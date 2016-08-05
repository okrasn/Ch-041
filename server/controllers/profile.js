/**
 * Created by olga on 05.08.16.
 */
var multer = require('multer');



/** API path that will upload the files */
  module.exports.upload= function(req, res, err){
    if(err){
      res.json({error_code:1,err_desc:err});
      return;
    }
    res.json({error_code:0,err_desc:null});
};