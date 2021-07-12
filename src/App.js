import React, { useState } from "react"
import Amplify, { Storage } from "aws-amplify"

import { withAuthenticator } from "@aws-amplify/ui-react"
import { CircularProgressbar } from "react-circular-progressbar"

import awsconfig from "./aws-exports"
import Dropzone from "react-dropzone-uploader"

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
  const fileInput = React.useRef()

  const handleClick = event => {
    event.preventDefault()
    let newArr = fileInput.current.files

    for (let i = 0; i < newArr.length; i++) {
      handleUpload(newArr[i], i + 1)
    }
  }

  const handleUpload = (file, i) => {
    console.log("f2", file)

    let newFileName = file.name.replace(/\..+$/, "")

    try {
      Storage.put(newFileName, file, {
        progressCallback(progress) {
          const percent = Math.round((progress.loaded / progress.total) * 100)
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
    <>
      <form
        className='upload-steps'
        onSubmit={handleClick}
        style={{ textAlign: "center", margin: "50px" }}
      >
        <label>
          Upload file:
          <input type='file' multiple ref={fileInput} />
        </label>
        <br />

        <button type='submit'>Upload</button>
      </form>
    </>
  )
}
export default withAuthenticator(MyUploader)
//export default Upload;
