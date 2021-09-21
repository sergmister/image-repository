import React from "react";
import { styled, alpha } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
} from "@mui/material";
import { Search as SearchIcon, Settings as SettingsIcon, Delete as DeleteIcon } from "@mui/icons-material";
import Upload from "src/components/Upload";
import Fuse from "fuse.js";

import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import { browser } from "@tensorflow/tfjs-core";

import * as mobilenet from "@tensorflow-models/mobilenet";

export interface ImageData {
  url: string;
  key: string;
  title: string;
  classifications: string[];
}

export default function App() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [searchTitles, setSearchTitles] = React.useState(true);
  const [searchClassifications, setSearchClassifications] = React.useState(true);

  const [images, setImages] = React.useState<ImageData[]>([]);

  const [search, setSearch] = React.useState("");

  let fuse = new Fuse(images, {
    keys: [...(searchTitles ? ["title"] : []), ...(searchClassifications ? ["classifications"] : [])],
  });

  const displayImages: ImageData[] = search === "" ? images : fuse.search(search).map((x) => x.item);

  const addImages = async (imgs: ImageData[]) => {
    for (const img of imgs) {
      const model = await mobilenet.load({ version: 2, alpha: 0.5 });

      const image = new Image();
      image.src = img.url;

      await new Promise((r) => (image.onload = r));
      const imageData = await browser.fromPixelsAsync(image);

      const predictions = await model.classify(imageData);

      for (const pred of predictions) {
        img.classifications.push(...pred.className.split(", "));
      }

      setImages((prevState) => prevState.concat([img]));
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Upload addImages={addImages} />

          <Box sx={{ flexGrow: 1, minWidth: "12px" }} />

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(event.target.value);
              }}
            />
          </Search>

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ ml: 1 }}
            onClick={handleClick}
            data-testid="settings-button"
          >
            <SettingsIcon />
          </IconButton>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            data-testid="settings-menu"
          >
            <MenuItem>
              <FormControlLabel
                control={
                  <Checkbox
                    name="titles"
                    checked={searchTitles}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setSearchTitles(event.target.checked);
                    }}
                  />
                }
                label="Search titles"
                sx={{ width: "100%", height: "100%" }}
              />
            </MenuItem>
            <MenuItem>
              <FormControlLabel
                control={
                  <Checkbox
                    name="classification"
                    checked={searchClassifications}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setSearchClassifications(event.target.checked);
                    }}
                  />
                }
                label="Search image classification"
                sx={{ width: "100%", height: "100%" }}
              />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container>
        <ImageList
          sx={{ width: 960, height: "100%", mx: "auto", overflow: "hidden" }}
          cols={3}
          rowHeight={280}
          data-testid="image-list"
        >
          {displayImages.map((image) => (
            <ImageListItem key={image.key}>
              <img src={image.url} alt={image.title} loading="lazy" />
              <ImageListItemBar
                title={image.title}
                subtitle={image.classifications.join(", ")}
                actionIcon={
                  <IconButton
                    sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                    aria-label={`delete ${image.title}`}
                    onClick={() => {
                      setImages((prevState) => prevState.filter((el) => el.key !== image.key));
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Container>
    </Box>
  );
}

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));
