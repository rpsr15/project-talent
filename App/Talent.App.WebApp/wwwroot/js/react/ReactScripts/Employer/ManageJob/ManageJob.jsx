import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Card, Button, Image, Label, ButtonGroup } from 'semantic-ui-react';




export default class ManageJob extends React.Component {

    
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.isLoading = false;
        //console.log("sfsdf");
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        this.state = {
            showActive: "true",
            showClosed: "true",
            sortBy: "asc",
            totalPages:1,
            activePage: 1,
            startJob:0,
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.closeJob = this.closeJob.bind(this);
        this.startLoader = this.startLoader.bind(this);
        this.handleDateSorting = this.handleDateSorting.bind(this);

        this.friendOptions = [
            {
                key: 'desc',
                text: 'Oldest First',
                value: 'desc'
            },
            {
                key: 'asc',
                text: 'Newest First',
                value: 'asc'
            },
        ];
    };

    init() {

        this.startLoader();
        this.loadData(() => {
            this.stopLoader();
        }
        )

    }

    componentDidMount() {
        this.init();
    };

    closeJob() {
        this.startLoader();
        this.loadData(() => {
            this.stopLoader();
        });

    }
    loadData(callback) {
        

        var link = `https://talentservicestalentnew15.azurewebsites.net/listing/listing/getSortedEmployerJobs?activePage=${this.state.activePage}&sortbyDate=${this.state.sortBy}&showActive=${this.state.showActive}&showClosed=${this.state.showClosed}&showExpired=true&showUnexpired=true&limit=6`;
        console.log(this.state.activePage);
        var cookies = Cookies.get('talentAuthToken');

        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                
                if (res.totalCount === 0) {
                }
                else {
                    this.setState({
                        totalPages: Math.ceil(res.totalCount / 6.0),
                        loadJobs: res.myJobs
                    });
                }

                
             
                callback();
            }.bind(this)
        });
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }
    handlePaginationChange(e, data,callback) {

        this.startLoader();
        
        this.setState({ activePage: data.activePage }, () => {
            
            this.loadData(function (res) {
       
                
            });
        });

        this.stopLoader();
        
    }

    startLoader() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = true;
        this.setState({ loaderData });//comment this
    }
    stopLoader() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
       loaderData.isLoading = false;
        this.setState({ loaderData });

    }

    handleDateSorting(e, data) {
        console.log(data.value);
        this.setState({
            sortBy: data.value
        }, function () {

                this.startLoader();
                this.loadData(() => {
                    this.stopLoader();
                });
        });
        
        
    }


    render() {
        let jobsFound = false;
        if(this.state.loadJobs)
        {
            jobsFound = this.state.loadJobs.length > 0;
        }
        

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <h1>List of jobs </h1>
                    <div className="row"><Icon name='filter'></Icon>
                        <p style={{ display: "inline" }}>Filter: </p>
                        <Dropdown text='Choose Filter'>
                            <Dropdown.Menu>
                                <Dropdown.Item text='Active' />
                                <Dropdown.Item text='Closed' />
                                <Dropdown.Item text='Expired' />
                                <Dropdown.Item text='Unexpired' />

                            </Dropdown.Menu>
                        </Dropdown>
                        <Icon name="calendar"> </Icon>
                        <p style={{ display: "inline" }}>Sort by date: </p>
                        <Dropdown

                            inline
                            options={this.friendOptions}
                            defaultValue={this.state.sortBy}
                            onChange={this.handleDateSorting}
                        />
                    </div>

                    <p> </p>

                    
                    {jobsFound ? (
                        <Card.Group itemsPerRow={3}>
                            {
                                this.state.loadJobs.map((job, i) => <JobSummaryCard key={job.id} id={job.id} title={job.title} location={job.location} description={job.summary} status={job.status} onClose={this.closeJob} />)

                            }

                        </Card.Group>
                        
                    ) : (
                            <p>No Jobs Found</p>
                        )}
                   
                    <div style={{ "textAlign": "center", "marginTop": "1rem", "marginBottom": "1rem" }}>
                        <Pagination
                            boundaryRange={0}
                            defaultActivePage={this.state.activePage}
                            ellipsisItem={null}
                            firstItem={null}
                            lastItem={null}
                            siblingRange={1}
                            onPageChange={this.handlePaginationChange}
                            totalPages={this.state.totalPages}
                        />
                    </div>


                </div>
            </BodyWrapper>

        )
    }
}