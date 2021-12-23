import { SearchOutlined } from '@ant-design/icons';
import {Typography } from 'antd'
import React, { useRef, useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { createEditorStateWithText } from 'draft-js-plugins-editor';
import { convertToHTML } from 'draft-convert';
//import htmlToText from 'html-to-text';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import styles from './style.less';
const { Text } = Typography;
const toolbar = { options: ['inline','link', 'textAlign','list'], list: { inDropdown: true }, textAlign: { inDropdown: true }, }

const TextEditor = props => {

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [isFirstCall, setfirstCall] = useState(false)

	useEffect(() => {
		let unmounted = false;
		if(isFirstCall == false && props.data){
			const blocksFromHtml = htmlToDraft(props.data);
			const { contentBlocks, entityMap } = blocksFromHtml;
			const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
			const editorState = EditorState.createWithContent(contentState);
			console.log("contentBlock : ", editorState);
			 setEditorState(editorState)
			 setfirstCall(true);
			return () => {
				unmounted = true;
			}
		}
    },[props])
	
	const onEditorStateChange = (editorState) => {
		console.log("onEditorStateChange : ", convertToHTML(editorState.getCurrentContent()));
		setEditorState(editorState);
		props.returnVal(convertToHTML(editorState.getCurrentContent()))
	}
	
  return (
    <div style={{textAlign:'center', padding:'0 0'}}>
		<Editor editorState={editorState} textAlignment={"left"} wrapperClassName="wrapperClassName" editorClassName={"mainEditorStyle EditorStyle"} toolbarClassName={"toolbarStyle wrapperStyle"} toolbar={toolbar} onEditorStateChange={onEditorStateChange} onDownArrow />
    </div>
  );
};

export default TextEditor;
