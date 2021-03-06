const { Pizza } = require('../models');

const pizzaController = {
    // get all pizzas
    getAllPizza(req, res) {
      Pizza.find({}) // sequelize uses findAll()
        .populate({
          path: 'comments',
          select: '-__v' // do not populate __v and show others
        })
        .select('-__v') // do not return field __v
        .sort({ _id: -1 }) // mongoose sort DESC 
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },
  
    // get one pizza by id
    getPizzaById({ params }, res) { // params deconstructed
      Pizza.findOne({ _id: params.id })
        .populate({
          path: 'comments',
          select: '-__v'
        })
        .select('-__v')
        .then(dbPizzaData => {
          // If no pizza is found, send 404
          if (!dbPizzaData) {
            res.status(404).json({ message: 'No pizza found with this id!' });
            return;
          }
          res.json(dbPizzaData);
        })
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },
    // createPizza
    createPizza({ body }, res) {
        Pizza.create(body) // body deconstructed
            .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.status(400).json(err));
     },
     // update pizza by id
    // update pizza by id
    /*
    Mongoose only executes the validators automatically 
    when we actually create new data. This means that a 
    user can create a pizza, but then update that pizza 
    with totally different data and not have it validated.
    Let's go ahead and fix that with a simple option setting.

    runValidators: true
    We need to include this explicit setting when updating data so
    that it knows to validate any new information.
    */
    updatePizza({ params, body }, res) {
      Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbPizzaData => {
          if (!dbPizzaData) {
            res.status(404).json({ message: 'No pizza found with this id!' });
            return;
          }
          res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    },
    // delete pizza
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
            res.status(404).json({ message: 'No pizza found with this id!' });
            return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    }
  }

module.exports = pizzaController;