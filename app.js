const express = require('express');
const expressSanitizer = require('express-sanitizer');
const methodOverride = require('method-override');
const BodyParser = require('body-parser');
const mongoose  = require('mongoose');
const port = process.env.PORT || 3000;
const app = express();

mongoose.connect('mongodb://localhost:27017/blogs');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(BodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});

var Blog = mongoose.model('Blog', blogSchema);

//RESTFUL ROUTES
app.get('/', (req, res)=> {
  res.redirect('/blogs');
});

app.get('/blogs', (req, res)=> {
    Blog.find({}, (err, blogs)=> {
      if (err) {
        console.log(err);
      } else {
        res.render('index', { blogs });
      }
    });
  });

app.get('/blogs/new', (req, res)=> {
    res.render('new');
  });

app.post('/blogs', (req, res)=> {
    //create blogs
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log('=========');
    console.log('new post crated');
    Blog.create(req.body.blog, (err, blog)=> {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/blogs');
      }
    });
  });

app.get('/blogs/:id', (req, res)=> {
    //find the campground with required id
    Blog.findById(req.params.id, (err, blog)=> {
      if (err) {
        console.log(err);
      } else {
        res.render('show', { blog });
      }
    });
  });

app.get('/blogs/:id/edit', (req, res)=> {
      Blog.findById(req.params.id, (err, blog)=> {
        if (err) {
          console.log(err);
        } else {
          res.render('edit', { blog });
        }
      });
    });

//update content
app.put('/blogs/:id', (req, res)=> {
        req.body.blog.body = req.sanitize(req.body.blog.body);
        Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, blog)=> {
          if (err) {
            res.redirect('/blogs');
          } else {
            res.redirect('/blogs/' + req.params.id);
          }
        });
      });

app.delete('/blogs/:id', (req, res)=> {
          Blog.findByIdAndRemove(req.params.id, (err, blog)=> {
            if (err) {
              res.redirect('/blogs');
            } else {
              res.redirect('/blogs');
            }
          });
        });

app.listen(port, ()=> {
  console.log(`Server has stated at ${port}`);
});
