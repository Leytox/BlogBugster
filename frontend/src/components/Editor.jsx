import PropTypes from "prop-types";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import {
  Alignment,
  Autoformat,
  Base64UploadAdapter,
  BlockQuote,
  Bold,
  CKFinder,
  CKFinderUploadAdapter,
  ClassicEditor,
  CloudServices,
  Code,
  CodeBlock,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalLine,
  HtmlEmbed,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  SpecialCharacters,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  Undo,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

const Editor = ({content, setContent}) => {
  return (
      <CKEditor
          editor={ClassicEditor}
          config={{
            toolbar: {
              items: [
                "heading",
                "|",
                "bold",
                "italic",
                "underline",
                "strikethrough",
                "link",
                "bulletedList",
                "numberedList",
                "|",
                "blockQuote",
                "insertTable",
                "mediaEmbed",
                "undo",
                "redo",
                "|",
                "imageUpload",
                "imageStyle:inline",
                "imageStyle:block",
                "imageStyle:side",
                "linkImage",
                "imageTextAlternative",
                "|",
                "alignment:left",
                "alignment:center",
                "alignment:right",
                "alignment:justify",
                "|",
                "removeFormat",
                "specialCharacters",
                "highlight",
                "horizontalLine",
                "htmlEmbed",
                "code",
                "codeBlock",
                "fontBackgroundColor",
                "fontColor",
                "fontFamily",
                "fontSize",
                "subscript",
                "superscript",
                "todoList",
              ],
            },
            plugins: [
              Alignment,
              Autoformat,
              BlockQuote,
              Bold,
              CKFinder,
              CKFinderUploadAdapter,
              Base64UploadAdapter,
              CloudServices,
              Essentials,
              FontBackgroundColor,
              FontColor,
              FontFamily,
              FontSize,
              Heading,
              Highlight,
              HorizontalLine,
              HtmlEmbed,
              Code,
              CodeBlock,
              Image,
              ImageCaption,
              ImageResize,
              ImageStyle,
              ImageToolbar,
              ImageUpload,
              Indent,
              IndentBlock,
              Italic,
              Link,
              List,
              MediaEmbed,
              Paragraph,
              PasteFromOffice,
              RemoveFormat,
              SpecialCharacters,
              Strikethrough,
              Subscript,
              Superscript,
              Table,
              TableToolbar,
              TextTransformation,
              TodoList,
              Underline,
              Undo,
              LinkImage,
            ],
            heading: {
              options: [
                {
                  model: "paragraph",
                  title: "Paragraph",
                  class: "ck-heading_paragraph",
                },
                {
                  model: "heading1",
                  view: "h1",
                  title: "Heading 1",
                  class: "ck-heading_heading1",
                },
                {
                  model: "heading2",
                  view: "h2",
                  title: "Heading 2",
                  class: "ck-heading_heading2",
                },
                {
                  model: "heading3",
                  view: "h3",
                  title: "Heading 3",
                  class: "ck-heading_heading3",
                },
                {
                  model: "heading4",
                  view: "h4",
                  title: "Heading 4",
                  class: "ck-heading_heading4",
                },
              ],
            },
            image: {
              toolbar: [
                "imageTextAlternative",
                "|",
                "imageStyle:inline",
                "imageStyle:block",
                "imageStyle:side",
                "linkImage",
              ],
            },
            alignment: {
              options: ["left", "center", "right", "justify"],
            },
            initialData: content,
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            setContent(data);
          }}
      />
  );
};

Editor.propTypes = {
  content: PropTypes.string,
  setContent: PropTypes.func.isRequired,
}

export default Editor;