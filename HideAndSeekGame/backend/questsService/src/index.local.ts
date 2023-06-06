import { app } from './index'

const port = 3000

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})
