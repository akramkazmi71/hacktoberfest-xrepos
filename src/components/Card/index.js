import React from 'react';
import './style.css';

const Card = props => {
	return (
		<div className='card'>
			<span className='card-number'>{props.index}</span>
			<h3>{props.repoName}</h3>
			<a href={props.repoIssue} target='_blank' rel='noopener noreferrer' role='button' className='btn'>Issue</a>
			<a href={props.repAddress} target='_blank' rel='noopener noreferrer' role='button' className='btn'>Repository</a>
		</div>
	);
};

export default Card;
