import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '../stories/Button';


  const ImageManipulator = () => {
    const [ crop , setCrop] = useState({
      unit: '%',
      width: 30,
      aspect: 16 / 9,
    })
    const [ src, setSrc ] = useState(null);
    const [ rotation, setRotation ] = useState(0);
    const [ croppedImageUrl, setCroppedImageUrl ] = useState(null);
    const [ imageRef, setImageRef ] = useState(null);
    const [ fileUrl, setFileUrl ] = useState(src);
    const [ imageDataUrl, setImageDataUrl] = useState(null)
 

  function handlePublish() {
    console.log("Node api will hit here: ", imageDataUrl)
  } 

  function handleReset() {
      setSrc(null);
      setCroppedImageUrl(null)
  }

  function rotateRight()  {
    const a = rotation + 90
    setRotation(a);
  }

  function rotateLeft () {
    const a = rotation - 90
    setRotation(a);
  }


  const onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setSrc(reader.result)
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // If you setState the crop in here you should return false.
  function onImageLoaded (image) {
    setImageRef(image);
  };

  function onCropComplete (crop) {
    makeClientCrop(crop);
  };

  function onCropChange (crop, percentCrop)  {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    setCrop( crop );
  };

  async function makeClientCrop(crop) {
    if (imageRef && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(
        imageRef,
        crop,
        'newFile.jpeg'
      );
      setCroppedImageUrl(croppedImageUrl);
    }
  }

  function getCroppedImg(image, crop, fileName){
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const url = canvas.toDataURL('image/jpeg');
    setImageDataUrl(url);

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(src);
        setFileUrl(window.URL.createObjectURL(blob));
        resolve(fileUrl);
      }, 'image/jpeg');
    });
  }
    
   
    return (
      <div className="App" style={{ marginTop: "5%" }}>
        <div>
          <input type="file" accept="image/*" onChange={onSelectFile} />
          <Button primary={true} label={"Rotate 90deg"} onClick={rotateRight}/>  
          <Button primary={false} label={"Reset"} onClick={handleReset}/>
          <Button primary={true} label={"Rotate -90deg"} onClick={rotateLeft}/>  
          <Button primary={false} label={"publish"} onClick={handlePublish}/>  
        </div>
        {src && (
          <ReactCrop
            src={src}
            crop={crop}
            ruleOfThirds
            onImageLoaded={onImageLoaded}
            onComplete={onCropComplete}
            onChange={onCropChange}
          />
        )}
        {croppedImageUrl && (
          <div>
          <img alt="Crop" style={{ maxWidth: '100%', marginTop: 10, transform: `rotate(${rotation}deg)` }} src={imageDataUrl} />
          </div>
        )}
      </div>
    );
}
export default ImageManipulator;