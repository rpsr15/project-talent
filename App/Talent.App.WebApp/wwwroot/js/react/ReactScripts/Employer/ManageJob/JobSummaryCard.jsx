import React from 'react';
import Cookies from 'js-cookie';
import { Popup } from 'semantic-ui-react';
import { Modal, Icon, Card, Button, Label, ButtonGroup } from 'semantic-ui-react';


export class JobSummaryCard extends React.Component {

    constructor(props) {
        super(props);
        this.closeJob = this.closeJob.bind(this)
    }
   
    closeJob() {

        var jsondata = { "id": this.props.id };

        var cookies = Cookies.get('talentAuthToken');

        $.ajax({
            url: 'https://talentservicestalentnew15.azurewebsites.net/listing/listing/closeJob?id=' + this.props.id,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(jsondata),
            contentType: "application/json",
            dataType: "json",
            success: function (res) {

                console.log("close response", res);
                this.props.onClose();

            }.bind(this)
        });
        
    }

    render() {

        let statusButton;
        if (this.props.status == 0) {
            statusButton = <Button size='tiny' color='green'>Active</Button>;
        } else if (this.props.status == 1) {
            statusButton = <Button size='tiny' color='red'>Closed</Button>;
        }
        else {
            statusButton = <Button size='tiny' color='red'>Expired</Button>;
        }
        let cityName = this.props.location.city;
        let countryName = this.props.location.country;

        if (this.props.location.city && this.props.location.country) {
            countryName = "," + countryName;
        }

        return (
            <div style={{ margin: '0.5rem' }}>



            <Card style={{ width: "25rem", height: "22rem" }}>
                <Card.Content>

                    <Card.Header style={{ overflow: "hidden", "text-overflow": "ellipsis" }}>{this.props.title}</Card.Header>
                    <Label color='black' ribbon='right'>
                        <Icon name='user'><span style={{ display: "inline-block", width: "8px" }}></span>0</Icon>
                    </Label>
                    <br />
                    <Card.Meta style={{ overflow: "hidden", "text-overflow": "ellipsis" }} >{cityName + countryName}</Card.Meta>
                    <Card.Description style={{ overflow: "hidden", "text-overflow": "ellipsis", height: '100%', wordWrap: 'break-word' }}>{this.props.description.substring(0, 200)}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                    {statusButton}

                    <ButtonGroup style={{ float: "right" }}>
                        {/* Close button */}
                        <Button disabled={this.props.status != 0} basic color='blue' style={{ fontSize: "0.8rem" }} onClick={this.closeJob} >
                            <Icon size='small' name='window close outline' />
                            <a style={{ textDecoration: 'none', color: 'blue' }} >Close</a>
                        </Button>
                        {/* Edit button */}
                        <Button disabled={this.props.status != 0} basic size='tiny' color='blue' style={{ fontSize: "0.8rem" }} onClick={this.editJob} >
                            <Icon size='small' name='edit' />
                            <a style={{ textDecoration: 'none', color: 'blue' }} href={'/EditJob/' + this.props.id}>Edit</a>
                        </Button>
                        {/* Copy button */}
                        <Button basic size='tiny' color='blue' style={{ fontSize: "0.8rem" }} >
                            <Icon size='small' name="copy outline"></Icon>
                            <a style={{ textDecoration: 'none', color: 'blue' }} >Copy</a>
                        </Button>
                    </ButtonGroup>

                </Card.Content>
                </Card>
                </div>
        );
    }
}