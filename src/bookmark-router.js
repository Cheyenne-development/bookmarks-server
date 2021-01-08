const express = require('express');
const { v4: uuid } = require('uuid');
const logger = require('./logger');
const store = require('./store');

const bookmarkRouter = express.Router();
const bodyParser = express.json();



bookmarkRouter
  .route('/bookmarks')
  .get((req, res) => {
    // move implementation logic into here
    res.json(store.bookmarks);
  })
  .post(bodyParser, (req, res) => {
    // move implementation logic into here
    const { title, url, description, rating } = req.body;
      
    if(!title){
      logger.error('Title is required');
      return res
        .status(400)
        .send("'title' is required");
    }
    if(!url) {
      logger.error('URL is required');
      return res
        .status(400)
        .send("'url' is required");
    }

    if(!rating) {
      logger.error('URL is required');
      return res
        .status(400)
        .send("'rating' is required");
    }


    if(!url.includes("http://") && !url.includes("https://")){
      logger.error('URL must include http:// or https://');
      return res
        .status(400)
        .send( "'url' must be a valid URL");
    }
      if(!Number.isInteger(rating) || rating < 0 || rating > 5){
        logger.error('Rating must be between 1 and 5');
      return res
        .status(400)
        .send( `'rating' must be a number between 0 and 5`);
      }
    
    const bookmark = {
      id: uuid(),
      title,
      url,
      description, 
      rating
    };
    
    store.bookmarks.push(bookmark);
      
    logger.info(`bookmark with id ${bookmark.id} created`);
      
    res
      .status(201)
      .location(`http://localhost:8000//bookmarks/${bookmark.id}`)
      .json(bookmark);
  });
    
bookmarkRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    // move implementation logic into here
    const { id } = req.params;
    const bookmark = store.bookmarks.find(book => book.id == id);
  
    // make sure we found a bookmark
    if (!bookmark) {
      logger.error(`bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Bookmark Not Found');
    }
    res.json(bookmark);
  })
  

    
        
  .delete((req, res) => {
    // move implementation logic into here
    const { id } = req.params;

    const bookmarkIndex = store.bookmarks.findIndex(book => book.id == id);
  
    if (bookmarkIndex === -1) {
      logger.error(`bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Bookmark Not Found');
    }
  
    //remove bookmark from lists
     
    store.bookmarks.splice(bookmarkIndex, 1);
  
    logger.info(`bookmark with id ${id} deleted.`);
  
    res
      .status(204)
      .end();
  });

module.exports = bookmarkRouter;