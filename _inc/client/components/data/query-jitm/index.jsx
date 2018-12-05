/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { fetchJitm, isFetchingJitm } from 'state/jitm';

class QueryJitm extends Component {
	static propTypes = { isFetchingJitm: PropTypes.bool };

	static defaultProps = {
		isFetchingJitm: false,
		route: { path: '' }
	};

	componentWillMount() {
		const path = this.props.route.path;
		const message_path = `wp:toplevel_page_jetpack${ path.replace( /\//, '_' ) }:admin_notices`;

		if ( ! this.props.isFetchingJitm ) {
			this.props.fetchJitm( message_path );
		}
	}

	// If we move to a different subpage in the Jetpack Dashboard, fetch a new JITM.
	componentDidUpdate( prevProps ) {
		let path = this.props.route.path;

		// If you are navigating to Jetpack > Settings > Writing, the URL will be wp-admin/admin.php?page=jetpack#/writing
		// Let's map that to the original wp-admin/admin.php?page=jetpack#/settings
		if ( '/writing' === path ) {
			path = '/settings';
		}

		const message_path = `wp:toplevel_page_jetpack${ path.replace( /\//, '_' ) }:admin_notices`;

		if (
			this.props.route.path !== prevProps.route.path &&
			! this.props.isFetchingJitm
		) {
			this.props.fetchJitm( message_path );
		}
	}

	render() {
		return null;
	}
}

export default connect(
	state => {
		return { isFetchingJitm: isFetchingJitm( state ) };
	},
	dispatch => {
		return {
			fetchJitm: message_path => dispatch( fetchJitm( message_path ) )
		};
	}
)( QueryJitm );
