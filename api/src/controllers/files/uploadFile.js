const path = require('path')
const mime = require('mime-types')
const fs = require('fs')

const { File } = require('./../../models')

const { getGdApi } = require('./../../utils/googleApi')

function getFileExtension(filename) {
  if (!filename) return ''

  const splittedFilename = filename.split('.')

  return splittedFilename[splittedFilename.length - 1]
}

async function uploadFile(req, res) {
  const { file } = req

  // Validate
  if (!file) {
    res.status(400).send('File not found')
    return
  }

  // Prepare file for uploading to google drive
  const fileMetadata = {
    name: file.originalname,
  }
  const media = {
    mimeType: file.mimetype,
    body: fs.createReadStream(file.path),
  }

  // Get api authentificated object
  const gdApi = await getGdApi()

  // Upload to google drive
  try {
    const response = await gdApi.files.create(
      {
        resource: fileMetadata,
        media,
        fields: 'id',
      },
      async (err, { data }) => {
        if (err) {
          res
            .status(200)
            .send('Erorr. during uploading file to google drive', err)

          return
        }

        const newDbFile = new File({
          gdFileId: data.id,
          filename: file.originalname,
          extension: getFileExtension(file.originalname),
        })

        await newDbFile.save()

        res.send(newDbFile)
      },
    )
  } catch (err) {
    res.status(400).send('Error during uploading a file')
  }

  // Clear temporary directory
  const directory = './../uploads'

  fs.readdir(directory, (err, files) => {
    if (err) throw err

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err
      })
    }
  })
}

module.exports = uploadFile
