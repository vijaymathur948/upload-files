import React, { useState } from "react"
import Amplify, { Storage } from "aws-amplify"

import { withAuthenticator } from "@aws-amplify/ui-react"
import { CircularProgressbar } from "react-circular-progressbar"

import awsconfig from "./aws-exports"
import Dropzone from "react-dropzone-uploader"
import "./App.css"
Amplify.configure(awsconfig)

const MyUploader = () => {
  const [totalProgress, setTotalProgress] = useState(0)

  // specify upload params and url for your files
  const getUploadParams = ({ meta }) => {
    return { url: "https://httpbin.org/post" }
  }

  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file }, status) => {
    console.log(status, meta, file)
  }

  // receives array of files that are done uploading when submit button is clicked
  const handleSubmit = files => {
    if (totalProgress === 100) {
      alert("Already Uploaded files Refesh the page. Try again")
    } else {
      files.map((f, index) => {
        console.log("f1", f.meta)
        handleUpload(f.meta, index + 1)
        return ""
      })
    }
  }
  const handleUpload = (file, i) => {
    let newFileName = file.name.replace(/\..+$/, "")

    try {
      Storage.put(newFileName, file, {
        progressCallback(progress) {
          const percent = Math.round((progress.loaded / progress.total) * 100)
          setTotalProgress(totalProgress + percent)

          console.log(
            `fileNo: ${i}, fileName: ${newFileName}, Percentage:  ${percent},}`
          )
        },
      }).then(e => {
        console.log("uploaded successfully fileNo", i, "fileName ", e)
      })
    } catch (error) {
      console.log("Error uploading file: ", error)
    }
    // const ReactS3Client = new S3(config);
    // ReactS3Client.uploadFile(file, newFileName).then((data) => {
    //   if (data.status === 204) {
    //     console.log("success");
    //   } else {
    //     console.log("fail");
    //   }
    // });
  }

  return (
    <div style={{ textAlign: "center", margin: "100px" }}>
      <Dropzone
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        onSubmit={handleSubmit}
        accept='image/*,audio/*,video/*'
        inputContent='Select Files'
      />
      <div style={{ display: "flex", margin: "20px" }}>
        <h1>File Uploading Status : </h1>

        <div
          style={{
            marginLeft: "50px",
            width: 100,
            height: 100,
          }}
        >
          <CircularProgressbar
            value={totalProgress}
            text={`${totalProgress}%`}
          />
        </div>
      </div>
    </div>
  )
}
function Upload() {
  const [files, setFiles] = useState([])

  const fileInput = React.useRef()
  const handleChange = event => {
    const list = []
    const files = [...event.target.files]
    files.map((obj, index) => {
      list.push({ index: index, name: obj.name, progress: 0 })
      return ""
    })
    setFiles(list)
  }
  const handleClick = event => {
    event.preventDefault()
    let newArr = fileInput.current.files
    if (newArr.length === 0) {
      alert("Please Select the file !")
    }
    for (let i = 0; i < newArr.length; i++) {
      handleUpload(newArr[i], i)
    }
  }

  const handleUpload = (file, i) => {
    let newFileName = file.name.replace(/\..+$/, "")
    try {
      Storage.put(newFileName, file, {
        progressCallback(progress) {
          const percent = Math.round((progress.loaded / progress.total) * 100)

          setFiles(files => {
            const currentIndex = files.findIndex(obj => obj.index === i)
            files[currentIndex].progress = percent
            return [...files]
          })

          // console.log(
          //   `fileNo: ${
          //     i + 1
          //   }, fileName: ${newFileName}, Percentage:  ${percent},}`
          // )
        },
      }).then(e => {
        console.log("uploaded successfully fileNo", i + 1, "fileName ", e)
      })
    } catch (error) {
      console.log("Error uploading file: ", error)
    }
    // const ReactS3Client = new S3(config);
    // ReactS3Client.uploadFile(file, newFileName).then((data) => {
    //   if (data.status === 204) {
    //     console.log("success");
    //   } else {
    //     console.log("fail");
    //   }
    // });
  }

  return (
    <>
      <form
        className='upload-steps'
        onSubmit={handleClick}
        style={{ textAlign: "center", margin: "20px" }}
      >
        <label>
          Upload file: &nbsp;&nbsp;
          <input type='file' onChange={handleChange} multiple ref={fileInput} />
          <br />
        </label>
        <br />
        <button type='submit'>Upload</button>
        &nbsp; &nbsp;
        <button
          type='reset'
          onClick={() => {
            if (files.filter(obj => obj.progress !== 0).length === 0) {
              console.log("0%")
              setFiles([])
            }
            if (files.filter(obj => obj.progress !== 100).length === 0) {
              console.log("100%")
              setFiles([])
            }
          }}
        >
          Reset
        </button>
      </form>
      <br />
      {false ? (
        <ol>
          {files.map((obj, index) => {
            return (
              <li
                key={index}
                style={{
                  display: "block",
                  padding: "5px",
                }}
              >
                <div
                  style={{
                    padding: "10px",
                    display: "inline-block",
                    width: "300px",
                  }}
                >
                  {index + 1} {obj.name}
                </div>
                <div
                  style={{
                    marginLeft: "50px",
                    width: 50,
                    height: 50,
                    display: "inline-block",
                  }}
                >
                  <CircularProgressbar
                    value={obj.progress}
                    text={`${obj.progress}%`}
                  />
                </div>
              </li>
            )
          })}
        </ol>
      ) : (
        <>
          {files.length > 0 && (
            <table>
              <tr>
                <th>File No</th>
                <th>File Name</th>
                <th>Percentage</th>
              </tr>
              {files.map((obj, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{obj.name}</td>
                    <td>
                      <div
                        style={{
                          marginLeft: "50px",
                          width: 50,
                          height: 50,
                          display: "inline-block",
                        }}
                      >
                        <CircularProgressbar
                          value={obj.progress}
                          text={`${obj.progress}%`}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </table>
          )}
        </>
      )}
    </>
  )
}
export default withAuthenticator(Upload)
//export default Upload;
