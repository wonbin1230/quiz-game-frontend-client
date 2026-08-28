import React, { useState, useEffect } from 'react';
import './App.css';
import { Container, Content, H1 } from './style';

const App = () => {
	useEffect(() => {
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Container>
				<Content>
					<H1>Hello World</H1>
				</Content>
			</Container>
		</>
	);
};

export default App;
