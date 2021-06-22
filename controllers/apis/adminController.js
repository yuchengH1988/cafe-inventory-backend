const User = require('../../models/user')
const Product = require('../../models/product')
const Ingredient = require('../../models/ingredient')
const Composition = require('../../models/composition')
const bcrypt = require('bcryptjs')

const adminController = {
  createUser: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword, isAdmin } = req.body
      // 確認 account & name & email & password & checkPassword 必填
      if (!account || !name || !email || !password || !checkPassword) {
        return res.status(400).json({ status: 'error', message: 'account, name, email, password, checkPassword are required!' })
      }
      // 確認 password & checkPassword 相同
      if (password !== checkPassword) {
        return res.status(400).json({ status: 'error', message: 'password & checkPassword must be same!' })
      }
      // 確認 email 格式正確
      const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
      if (!emailRule.test(email)) {
        return res.status(400).json({ status: 'error', message: 'email format is incorrect!' })
      }
      //判斷帳號、名稱是否存在
      const user = await User.find({ $or: [{ account }, { name }] })
      if (user.length) { return res.status(409).json({ status: 'error', message: 'this account or name has been used!' }) }
      //新增User
      await User.create({
        account, name, email, isAdmin,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      })

      return res.status(200).json({ status: 'success', message: 'register success!' })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  toggelAdmin: async (req, res, next) => {
    try {
      const _id = req.params.id
      let user = await User.findById(_id)
      user.isAdmin = user.isAdmin ? false : true
      await user.save()
      return res.status(200).json({ status: 'success', message: `user ${user.name} ${user.account} have changed to ${user.isAdmin ? 'Admin' : 'User'}` })

    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const _id = req.params.id
      await User.findByIdAndDelete(_id, (err) => {
        if (err) {
          return res.status(404).json({ status: 'error', message: "Can't delete this User." })
        } else {
          return res.status(200).json({ status: 'success', message: 'The User has removed successfully!' })
        }
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.find({})
      return res.status(200).json({ status: 'success', users })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  createProduct: async (req, res, next) => {
    try {
      const { name, size, price } = req.body
      const product = await Product.find({ name, size })
      if (product.length !== 0) {
        return res.status(400).json({ status: 'error', message: 'Both name and size have been registed at same product' })
      }
      await Product.create({
        name, size, price
      })
      return res.status(200).json({ status: 'success', message: 'Product have been built.' })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  getProduct: async (req, res, next) => {
    try {
      const _id = req.params.id
      await Product.findById(_id, (err, product) => {
        if (err) {
          return res.status(400).json({ status: 'error', message: 'Can\'t find this product' })
        } else {
          return res.status(200).json({ status: 'success', product })
        }
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  getProducts: async (req, res, next) => {
    try {
      await Product.find({}, (err, products) => {
        if (err) {
          return res.status(400).json({ status: 'error', message: 'Can\'t find this product' })
        } else {
          return res.status(200).json({ status: 'success', products })
        }
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  updateProduct: async (req, res, next) => {
    try {
      const _id = req.params.id
      const { name, size, price } = req.body
      await Product.findByIdAndUpdate(_id, { name, size, price }, { useFindAndModify: false, new: true }, (err) => {
        if (err) {
          return res.status(400).json({ status: 'error', message: 'Can\'t find the id' })
        } else {
          return res.status(200).json({ status: 'success', message: 'Product has been updated.' })
        }
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  deleteProduct: async (req, res, next) => {
    try {
      const _id = req.params.id
      await Product.findByIdAndDelete(_id, (err) => {
        if (err) {
          return res.status(400).json({ status: 'error', message: 'Can\'t find the id' })
        } else {
          return res.status(200).json({ status: 'success', message: 'Product has been deleted.' })
        }
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  getIngredients: async (req, res, next) => {
    try {
      await Ingredient.find({}, (err, ingredients) => {
        if (err) {
          return res.status(400).json({ status: 'error', message: 'Can\'t find ingredients' })
        } else {
          return res.status(200).json({ status: 'success', ingredients })
        }
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  getIngredient: async (req, res, next) => {
    try {
      const _id = req.params.id
      await Ingredient.findById(_id, (err, ingredient) => {
        if (err) {
          return res.status(400).json({ status: 'error', message: 'Can\'t find this ingredient' })
        } else {
          return res.status(200).json({ status: 'success', ingredient })
        }
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  createIngredient: async (req, res, next) => {
    try {
      const { name, unit, unitName, unit2, unit2Name } = req.body
      const ingredient = await Ingredient.find({ name })
      if (ingredient.length !== 0) {
        return res.status(400).json({ status: 'error', message: 'This name have been registed in ingredient' })
      }
      await Ingredient.create({
        name, unit, unitName, unit2, unit2Name
      })
      return res.status(200).json({ status: 'success', message: 'New ingredient have been built.' })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  updateIngredient: async (req, res, next) => {
    try {
      const _id = req.params.id
      const { name, unit, unitName, unit2, unit2Name } = req.body
      await Ingredient.findByIdAndUpdate(_id, { name, unit, unitName, unit2, unit2Name }, { useFindAndModify: false, new: true }, (err) => {
        if (err) {
          return res.status(400).json({ status: 'error', message: 'Can\'t find the id' })
        } else {
          return res.status(200).json({ status: 'success', message: 'Ingredient has been updated.' })
        }
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  deleteIngredient: async (req, res, next) => {
    try {
      const _id = req.params.id
      await Ingredient.findByIdAndDelete(_id, (err) => {
        if (err) {
          return res.status(400).json({ status: 'error', message: 'Can\'t find the id' })
        } else {
          return res.status(200).json({ status: 'success', message: 'Ingredient has been deleted.' })
        }
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  getCompositions: async (req, res, next) => {
    try {
      await Composition.find({}, (err, compositions) => {
        if (err) {
          return res.status(400).json({ status: 'error', message: 'Can\'t find the product' })
        } else {
          return res.status(200).json({ status: 'success', compositions })
        }
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },




  // : async (req, res, next)=>{
  // try { } catch (error) {
  //   console.log(error)
  //   return next(error)
  // }}

}
module.exports = adminController