import React, { useState } from "react";
import { tags, uniqueTagColors } from "../../App";
import { Link, useLocation } from "react-router-dom";

interface Props {
  newTag: string;
  setNewTag: (newTag: string) => void;
  isLink?: boolean;
}
const TagButtons = ({ newTag, setNewTag, isLink = false }: Props) => {
  const [tagColors, setTagColors] = useState(["#FFF", "#FFF", "#FFF", "#FFF"]);

  const location = useLocation();

  return (
    <>
      {tags.map((tag, index) => {
        let nextTagColors = ["#FFF", "#FFF", "#FFF", "#FFF"];
        nextTagColors[index] = uniqueTagColors[index];
        let isSelected = newTag === tag;
        return isLink ? (
          <Link
            key={tag}
            to={
              isSelected
                ? "/tasks/" + location.search
                : `/tasks/${tag + location.search}`
            }
          >
            <button
              className={`tag tag-${tag}`}
              id={tag}
              style={{
                border: `1px solid ${tagColors[index]}`,
              }}
              onClick={() => {
                if (newTag === tag) {
                  setTagColors(["#FFF", "#FFF", "#FFF", "#FFF"]);
                  setNewTag("tag");
                } else {
                  setNewTag(tag);
                  setTagColors(nextTagColors);
                }
              }}
              key={index}
            >
              {tag}
            </button>
          </Link>
        ) : (
          <button
            className={`tag tag-${tag}`}
            id={tag}
            style={{
              border: `1px solid ${tagColors[index]}`,
            }}
            onClick={() => {
              if (isSelected) {
                setTagColors(["#FFF", "#FFF", "#FFF", "#FFF"]);
                setNewTag("tag");
              } else {
                setNewTag(tag);
                setTagColors(nextTagColors);
              }
            }}
            key={index}
          >
            {tag}
          </button>
        );
      })}
    </>
  );
};

export default TagButtons;
