import React, { Component } from 'react';
import { Container, Row } from 'reactstrap';
import AboutConstants from './AboutConstants';
import RSContainer from '../RSContainer/RSContainer';
import RSTeamMember from '../RSTeamMember/RSTeamMember';
import GitHubStats from '../GitHubStats/GitHubStats';
import RSTool from '../RSTool/RSTool';
import RSLink from '../RSLink/RSLink';
import RSSearchUtils from '../../utilities/RSSearchUtils';

import "isomorphic-fetch";

import './RSAboutPage.css';

export default class RSAboutPage extends Component {

    constructor() {
        super();

        this.state = {
            loaded: false,
            teammates: [],
            total_commits: 0,
            total_issues: 0,
            total_unittests: 0
        };
    }

    componentDidMount() {
        RSSearchUtils.request(`about`)
            .then((json) => {
                this.setState({
                    loaded: true,
                    teammates: json.teammates,
                    total_commits: json.total_commits,
                    total_issues: json.total_issues,
                    total_unittests: json.total_unittests
                });
            });
    }

    getTeamMembers() {
        return (
            <Row>
                {
                    this.state.teammates.map((member) => {
                        return <RSTeamMember
                        key={member.profile}
                        icon={member.profile}
                        name={member.name}
                        role={member.duties}
                        bio={member.bio}
                        commits={member.commits}
                        issues={member.issues}
                        tests={member.unittests}
                                />
                    })
                }
            </Row>
        );
    }

    getStats() {
        return (
            <Row>
                <GitHubStats    issues={this.state.total_issues}
                                commits={this.state.total_commits}
                                tests={this.state.total_unittests}
                />
            </Row>
        );
    }

    getTools(toolList) {
        return (
            <div>
                { toolList.map((item) => <RSTool key={item.title} toolDesc={item.desc} toolName={item.title}/>) }
            </div>
        );
    }

    getLinks() {
        return (
            <Row>
                { AboutConstants.links.data.map((item) => <RSLink key={item.url} title={item.title} url={item.url}/>) }
            </Row>
        );
    }

    render() {

        if (!this.state.loaded) { return (<Row className="nav-padding"><h2 className="mx-auto">Loading...</h2></Row>); }

        return (
            <Container className="nav-padding">
                <RSContainer    title={AboutConstants.about.title}
                                subtitle={AboutConstants.about.subtitle}
                                body={ (<p>{ AboutConstants.about.body }</p>) }/>


                <RSContainer    title={AboutConstants.team.title}
                                body={ this.getTeamMembers() }
                                    />

                <RSContainer    title={AboutConstants.github.title}
                                subtitle={AboutConstants.github.subtitle}
                                body={ this.getStats() }/>

                <RSContainer    title={AboutConstants.tools.title}
                                subtitle={AboutConstants.tools.subtitle}
                                body={ this.getTools(AboutConstants.tools.data)}/>

                <RSContainer    title={AboutConstants.extra_tools.title}
                                subtitle={AboutConstants.extra_tools.subtitle}
                                body={ this.getTools(AboutConstants.extra_tools.data)}/>
                <RSContainer    title={AboutConstants.links.title}
                                subtitle={AboutConstants.links.subtitle}
                                body={ this.getLinks()}/>
            </Container>
        );
    }
}
