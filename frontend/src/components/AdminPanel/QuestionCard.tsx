import React from 'react';
import '../../style/QuestionCard.css';
import IQuestion from '../../types/IQuestion';

function QuestionCard(props: QuestionCardProps): React.ReactElement {
	return (
		<div className='question-card'>
			<div className='question-card-conten'>
				<div className='question-statement'>{props.question.statement}</div>
				<div className='question-answers'>
					{props.question.answers.map(a => <div className='question-answer' key={a}>{a}</div>)}
				</div>
				<div className='question-labels'>
					{props.question.labels && props.question.labels.map(l => <div className='question-label' key={l}>{l}</div>)}
				</div>
			</div>
			<div className='question-card-actions'>
				<div className='question-card-edit' onClick={props.edit}>
					<span className="material-icons">
						edit
					</span>
				</div>
				<div className='question-card-delete' onClick={props.del}>
					<span className="material-icons">
						delete
					</span>
				</div>
			</div>
		</div>
	);
}
export default QuestionCard;

interface QuestionCardProps {
	/**
	 * Function to call when the user wants to delete the question.
	 */
	del: () => Promise<void>;
	/**
	 * Function to call when the user wants to edit the question.
	 */
	edit: () => void;
	/**
	 * The data of the question this card is displaying.
	 */
	question: IQuestion;
}
