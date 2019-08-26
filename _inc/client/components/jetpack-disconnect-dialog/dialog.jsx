/**
 * External dependencies
 */
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

/**
 * Internal dependencies
 */
import FeaturesContainer from './container';
import { getSiteID, getSitePlan } from 'state/site';
import Survey from './survey';

const JETPACK_DISCONNECT_INITIAL_STEP = 'jetpack_disconnect_initial_step';
const JETPACK_DISCONNECT_SURVEY_STEP = 'jetpack_disconnect_survey_step';

class JetpackDisconnectDialog extends Component {
	static propTypes = {
		closeDialog: PropTypes.func.isRequired,
		disconnectJetpack: PropTypes.func.isRequired,
		siteId: PropTypes.number,
		sitePlan: PropTypes.object,
		showModalClose: PropTypes.bool,
		location: PropTypes.string.isRequired,
	};

	static defaultProps = {
		showModalClose: false,
	};

	constructor( props ) {
		super( props );

		this.state = {
			step: JETPACK_DISCONNECT_INITIAL_STEP,
			surveyAnswerId: null,
			surveyAnswerText: '',
		};
		this.handleFeaturesContinueClick = this.handleFeaturesContinueClick.bind( this );
		this.handleJetpackDisconnect = this.handleJetpackDisconnect.bind( this );
		this.handleSurveyAnswerChange = this.handleSurveyAnswerChange.bind( this );
	}

	handleJetpackDisconnect() {
		// console.log( `surveyAnwserId: ${ this.state.surveyAnswerId }` );
		// this.props.disconnectJetpack();
		// this.props.closeDialog();
	}

	handleFeaturesContinueClick() {
		this.setState( {
			step: JETPACK_DISCONNECT_SURVEY_STEP,
		} );
	}

	handleSurveyAnswerChange( surveyAnswerId, surveyAnswerText ) {
		this.setState( {
			surveyAnswerId,
			surveyAnswerText,
		} );
	}

	renderInitialStep() {
		return (
			<FeaturesContainer
				onContinueButtonClick={ this.handleFeaturesContinueClick }
				onCloseButtonClick={ this.props.closeDialog }
				showModalClose={ this.props.showModalClose }
			/>
		);
	}

	renderSurveyStep() {
		const { surveyAnswerId, surveyAnswerText } = this.state;

		return (
			<Survey
				onCloseButtonClick={ this.props.closeDialog }
				onDisconnectButtonClick={ this.handleJetpackDisconnect }
				onSurveyAnswerChange={ this.handleSurveyAnswerChange }
				surveyAnswerId={ surveyAnswerId }
				surveyAnswerText={ surveyAnswerText }
				showModalClose={ this.props.showModalClose }
			/>
		);
	}

	render() {
		const { step } = this.state;
		return JETPACK_DISCONNECT_SURVEY_STEP === step
			? this.renderSurveyStep()
			: this.renderInitialStep();
	}
}

export default connect( state => ( {
	siteId: getSiteID( state ),
	sitePlan: getSitePlan( state ),
} ) )( JetpackDisconnectDialog );
