import * as React from 'react';
import styled from 'styled-components';

// interface TextAreaProps extends React.ComponentPropsWithoutRef<'textarea'> {}

var TextArea = React.forwardRef<HTMLTextAreaElement, React.ComponentPropsWithoutRef<'textarea'>>(function TextArea({ ...props }, forwardedRef) {
	return <StyledTextArea {...props} ref={forwardedRef} />;
});

export default TextArea;

var StyledTextArea = styled.textarea`
	resize: none;
	padding: var(--textarea-padding);
	width: 100%;
	display: block;
	border-radius: var(--border-radius-normal);
`;
