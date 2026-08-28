import styled from 'styled-components';

export const Container = styled.div`
	width: 100%;
	min-height: 100vh;
	background-color: var(--background-color);
`;

export const Content = styled.div`
	width: 100%;
	height: calc(100vh - 5rem);
	justify-content: center;
	padding: 0 10%;
	background-color: var(--background-color);
	overflow-x: hidden;
	overflow-y: auto;
	&::-webkit-scrollbar {
		display: none;
	}
	@media (max-width: 430px) {
		overflow-y: hidden;
	}

	@keyframes object1 {
		50% {
			left: -13%;
			top: 41%;
		}
	}

	@keyframes object1-pad {
		50% {
			left: -27%;
			top: 39%;
		}
	}

	@keyframes object1-mobile {
		50% {
			left: -34%;
			top: 49%;
		}
	}

	&::before {
		position: absolute;
		content: '';
		height: 37.5rem;
		width: 37.5rem;
		left: -12%;
		top: 40%;
		border-radius: 50%;
		background: var(--object-color);
		animation: object1 6s linear infinite;
		@media (max-width: 768px) {
			height: 30rem;
			width: 30rem;
			left: -28%;
			top: 40%;
			animation: object1-pad 6s linear infinite;
		}
		@media (max-width: 430px) {
			height: 15rem;
			width: 15rem;
			left: -35%;
			top: 50%;
			animation: object1-mobile 6s linear infinite;
		}
	}
`;

export const H1 = styled.h1`
	display: block;
	font-size: 7vw;
	font-weight: 900;
	color: var(--main-font-color);
	text-align: center;
`;
