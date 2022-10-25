var express = require('express');
var router = express.Router();
//import { v4 as uuidv4 } from 'uuid';


//read comment all
router.get('/', function(req, res, next) {
 res.send('render comment')
});

//create comment get
router.get('/newComment', (req, res,next) => {
  res.send('create new comment')
});

//read comment detail get
router.get('/:commentId', function(req, res, next) {
  return res.send('read comment'+ req.params.postId);
});

//update comment
router.put('/:commentId', (req, res) => {

  return res.send('update comment'+ req.params.postId);
});

//delete comment
router.delete('/:commentId',(req,res)=>{

  return res.send('update comment'+ req.params.postId);
})


module.exports = router;
