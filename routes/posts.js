var express = require('express');
var router = express.Router();
//import { v4 as uuidv4 } from 'uuid';


//read posts
router.get('/', function(req, res, next) {
 res.send('render posts')
});

//create post get
router.get('/newPost', (req, res,next) => {
  //res.send('new post')
  res.send('create new post')
});

//read post detail get
router.get('/:postId', function(req, res, next) {
  return res.send('read post'+ req.params.postId);
});



//update post
router.put('/:postId', (req, res) => {

  return res.send('update post'+ req.params.postId);
});

//delete post
router.delete('/:postId',(req,res)=>{

  return res.send('update post'+ req.params.postId);
})


module.exports = router;
