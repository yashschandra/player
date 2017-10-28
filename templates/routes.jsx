import React from 'react';
import {Route, IndexRoute, IndexRedirect} from 'react-router';
import Layout  from './Layout.jsx';
import HomePage  from './HomePage.jsx';
import UploadPage  from './UploadPage.jsx';
import TagsPage  from './TagsPage.jsx';
import DetailsPage  from './DetailsPage.jsx';

const routes=(
	<Route path="/" component={Layout}>
		<IndexRoute component={HomePage}/>
		<Route path="/details/:songId" component={DetailsPage}/>
		<Route path="/upload" component={UploadPage}/>
		<Route path="/tags" component={TagsPage}/>
	</Route>
);

export default routes;
