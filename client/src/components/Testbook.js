import React, { Component } from 'react';
import axios from 'axios';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { withStyles } from '@material-ui/core/styles';
import QuestionModal from './QuestionModal';

import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
    wrap: {
        display: 'flex',
        height: '100%'
    },
    bookBody: {
        flex: '0 1 1280px',
        margin: '0 auto',
        height: '100%'
    },
    bookHeader: {
        display: 'flex',
        height: theme.spacing.unit * 7,
        backgroundColor: 'gray'
    },
    addBtn: {
        margin: 'auto 2% auto auto',
        height: theme.spacing.unit * 5
    },
    bookContent: {

    },
    questionlist: {

    },
    questionBox: {
    },
    panel: {

    },
    panelDetail: {
        display: 'flex',
        width: '100%'
    },
    panelNo: {
        flex: '0 0 50px'
    },
    panelTitle: {
        flex: '1 1 300px'
    },
    panelPart: {
        flex: '1 1 100px'
    },
    panelTag: {
        flex: '1 1 200px'
    },
    panelDetailScript: {
        flex: '1 1 400px'
    },
    panelDetailSelection: {
        flex: '1 1 400px'
    },
    panelDetailControl: {
        flex: '0 1 50px'
    },
    tagChip: {
        margin: theme.spacing.unit / 2
    },
    icon: {
        "&:hover": {
            cursor: 'pointer'
        },
        '&:active': {
            transform: 'translateY(3px)'
        }
    }
});

class Testbook extends Component {

    constructor(props) {
        super(props)

        this.state = {
            openModal: false,
            questions: [],
            bookId: '5c95e5dad06b5943d4904dc0',
            qusetionId: '',
            expanded: null
        }
    }

    componentDidMount() {
        this.getQuestisonList()
    }

    getQuestisonList = () => {
        axios({
            method: 'get',
            url: '/api/book/' + this.state.bookId + '/question/list'
        }).then(res => {
            const list = res.data.map((c) => {
                return Object.assign(c, { expanded: false });
            });
            this.setState({ questions: list })
        })
            .catch(err => console.log(err));
    }

    refreshQuestions = () => {
        this.getQuestisonList()
    }

    closeModal = () => {
        this.setState({
            ...this.state,
            openModal: false,
            qusetionId: ''
        })
    }

    openAddModal = () => {
        this.setState({
            ...this.state,
            openModal: true,
            qusetionId: ''
        })
    }

    openEditModal = (id) => {
        this.setState({
            ...this.state,
            openModal: true,
            qusetionId: id
        })
    }

    deleteQuestion = (questionId) => {
        axios({
            method: 'delete',
            url: '/api/book/' + this.state.bookId + '/question/' + questionId,
        }).
            then(this.refreshQuestions())
            .catch(err => console.log(err));
    }

    handleExpandPanel = (i) => {
        const modifiedArray = this.state.questions.map((value, index) => {
            return index === i ? ({ ...value, expanded: !this.state.questions[i].expanded }) : value
        });

        this.setState({
            questions: modifiedArray
        });
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.wrap}>
                <QuestionModal
                    openModal={this.state.openModal}
                    bookId={this.state.bookId}
                    questionId={this.state.qusetionId}
                    closeModal={this.closeModal}
                    refreshQuestions={this.refreshQuestions}>
                </QuestionModal>
                <div className={classes.bookBody}>
                    <div className={classes.bookHeader}>
                        <Button className={classes.addBtn} onClick={this.openAddModal}>ADD</Button>
                    </div>
                    <div className={classes.bookContent}>
                        <div className={classes.questionlist}>
                            {this.state.questions.map((c, index) => {
                                return <div className={classes.questionBox}>
                                    <ExpansionPanel className={classes.panel} expanded={c.expanded} key={index} onChange={() => this.handleExpandPanel(index)}>
                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                            <div className={classes.panelNo}>
                                                <Typography>{index + 1}</Typography>
                                            </div>
                                            <div className={classes.panelTitle}>
                                                <Typography>{c.info.title}</Typography>
                                            </div>
                                            <div className={classes.panelPart}>
                                                <Typography>{c.info.part}</Typography>
                                            </div>
                                            <div className={classes.panelTag}>
                                                {c.info.tagList.map((tag, index) => {
                                                    return <Chip key={index} label={tag} className={classes.tagChip} />
                                                })}
                                            </div>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>
                                            <div className={classes.panelDetail}>
                                                <div className={classes.panelDetailScript}>
                                                    {c.question.script}
                                                </div>
                                                <div className={classes.panelDetailSelection}>
                                                    selections
                                                </div>
                                                <div className={classes.panelDetailControl}>
                                                    <EditIcon className={classes.icon} onClick={() => this.openEditModal(c._id)} />
                                                    <DeleteIcon className={classes.icon} onClick={() => this.deleteQuestion(c._id)} />
                                                </div>
                                            </div>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Testbook);