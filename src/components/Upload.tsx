import React from "react";
import { useDropzone } from "react-dropzone";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  TextField,
  Typography,
} from "@mui/material";
import { v4 } from "uuid";
import { ImageData } from "src/App";

export default function Upload(props: { addImages: (imgs: ImageData[]) => void }) {
  const [open, setOpen] = React.useState(false);

  const [images, setImages] = React.useState<ImageData[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    const images = acceptedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      title: file.name,
      key: v4(),
      classifications: [],
    }));

    setImages(images.slice());
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    onDrop,
  });

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    setImages((prevImages) => {
      let newImages = [...prevImages];
      let image = images[index];
      image.title = event.target.value;
      newImages[index] = image;
      return newImages;
    });
  };

  const cancel = () => {
    setOpen(false);
    setImages([]);
  };

  const upload = async () => {
    setOpen(false);
    props.addImages(images);
    setImages([]);
  };

  return (
    <div>
      <Button variant="contained" onClick={() => setOpen(true)} data-testid="upload-button">
        Upload
      </Button>
      <Dialog open={open} data-testid="upload-dialog">
        <DialogTitle>Upload Images</DialogTitle>
        <DialogContent>
          {images.length === 0 ? (
            <Box
              {...getRootProps()}
              sx={{
                margin: "4px",
                width: "480px",
                height: "320px",
                border: "4px dashed rgba(100, 100, 100, .4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <input {...getInputProps()} />
              <Typography variant="body1" sx={{ textAlign: "center", opacity: 0.4, mb: 1 }}>
                Drag 'n' drop some files here, or click to select files
                <br />
                (Only *.jpeg and *.png images will be accepted)
              </Typography>
            </Box>
          ) : (
            <List sx={{ maxHeight: 400 }}>
              {images.map((image, index) => {
                return (
                  <ListItem key={image.key}>
                    <ListItemAvatar>
                      <Avatar sx={{ width: 160, height: 120, borderRadius: 2 }} variant="square" src={image.url} />
                    </ListItemAvatar>
                    <TextField
                      sx={{ ml: 2, width: 480 }}
                      label="Title"
                      variant="outlined"
                      value={image.title}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        onTitleChange(event, index);
                      }}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancel}>Cancel</Button>
          <Button variant="contained" onClick={upload} data-testid="upload-upload">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
