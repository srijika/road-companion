import React, {useState, useEffect} from "react";

export default function VideoInput(props) {
  const { width, height, videoFileData } = props;

  const inputRef = React.useRef();

  const [source, setSource] = React.useState();


  useEffect(() => {
    if(!['', undefined, null].includes(videoFileData)) {
        setSource(props.videoFileData)
    }

  }, [])    

  const handleFileChange = (event) => {

    let fileSize = event.target.files[0].size / 1024 /1024;

    if(fileSize > 1) {
      setSource('')
      alert('File size exceeds 1 MB');
      return ;
    }

    const file = event.target.files[0];
    props.videoFile(file);
    const url = URL.createObjectURL(file);
    setSource(url);
  };

  const handleChoose = (event) => {
    inputRef.current.click();
  };

  return (
    <div className="VideoInput">
      <input
        ref={inputRef}
        className="VideoInput_input"
        type="file"
        onChange={handleFileChange}
        accept=".mov,.mp4"
      />
      
      {source && (
        <video
          className="VideoInput_video"
          width="100%"
          height={height}
          controls
          src={source}
        />
      )}
      {/* <div className="VideoInput_footer">{source || "Nothing selectd"}</div> */}
    </div>
  );
}
