import app from './app'

const PORT = process.env.PORT || 3000

const startSever = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Sever running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start the server:', error)
    process.exit(1)
  }
}

startSever()
