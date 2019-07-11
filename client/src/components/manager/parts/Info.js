import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
import AddCircle from '@material-ui/icons/AddCircle';


const styles = theme => ({
    body: {
        margin: '5px'
    },
    head: {
        display: 'flex',
        height: '40px'
    },
    headLabel: {
        margin: 'auto auto auto 20px',
    },
    addBtn: {
        margin: 'auto 10px 10px auto'
    },
    item: {
        display: 'flex',
        flexDirection: 'row-reverse'
    },
    itemBar: {
        display: 'flex'
    },
    itemBody: {
        width: '94%'
    },
    removeBtnConteiner: {
        margin: '14px auto auto auto'
    },
    itemSubtitle: {
        marginTop: '12px',
        width: '97%'
    },
    removeBtn: {
        fontSize: '20px'
    }
});

const ExpansionPanel = withStyles({
    root: {
        border: '1px solid rgba(0,0,0,.125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
    },
    expanded: {
        margin: 'auto',
    },
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
    root: {
        backgroundColor: 'rgba(0,0,0,.03)',
        borderBottom: '1px solid rgba(0,0,0,.125)',
        marginBottom: -1,
        height: 52,
        '& div': {
            margin: 'auto 0',
        },
        '&$expanded': {
            height: 52,
            minHeight: 52
        },
    },
    content: {
        '&$expanded': {
        },
    },
    expanded: {},
})(props => <MuiExpansionPanelSummary  {...props} />);

ExpansionPanelSummary.muiName = 'ExpansionPanelSummary';

const ExpansionPanelDetails = withStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column'
    },
}))(MuiExpansionPanelDetails);

class Info extends Component {

    constructor(props) {
        super(props)

        this.state = {
            title: '',
            tag: '',
            tagList: [],
            expanded: true
        }

    }

    componentDidUpdate() {
        this.props.updateInfoData({
            title: this.state.title,
            tagList: this.state.tagList
        });
    }

    render() {
        const { classes } = this.props;
        const { explanations } = this.state;

        return (
            <div className={classes.body} >
                <ExpansionPanel expanded={this.state.expanded} >
                    <ExpansionPanelSummary className={classes.head} expandIcon={<ExpandMoreIcon />} onClick={this.handleExpanded}>
                        <Typography className={classes.headLabel} variant="title" gutterBottom>Info</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div>
                            <TextField
                                name='title'
                                label="Title"
                                margin="normal"
                                className={classes.selection}
                                value={this.state.title}
                                onChange={this.handleTextChange}
                            />
                        </div>
                        <div className={classes.tag}>
                            <TextField
                                className={classes.tagText}
                                name="tag"
                                label="Tag"
                                margin="normal"
                                multiline
                                value={this.state.tag}
                                onChange={this.handleTextChange}
                            />
                            <Icon className={classes.tagIcon} color="action">
                                <AddCircle onClick={() => this.addInfoTag(this.state.tag)} />
                            </Icon>
                        </div>
                        <div>
                            {this.state.tagList.map((c, index) => {
                                return (
                                    <Chip
                                        key={index}
                                        label={c}
                                        onDelete={() => this.deleteInfoTag(index)}
                                        className={classes.chip}
                                    />
                                )
                            })
                            }
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        );
    }

    handleExpanded = () => {
        this.setState({
            ...this,
            expanded: !this.state.expanded
        })
    }

    addInfoTag = (tag) => {
        this.setState({
            ...this.state,
            tag: '',
            tagList: this.state.tagList.concat(tag)
        })
    }

    deleteInfoTag = (index) => {
        this.setState({
            ...this.state,
            tagList: this.state.tagList.filter((_, i) => i !== index)
        })
    }

    handleTextChange = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value
        })
    }
}

export default withStyles(styles)(Info);