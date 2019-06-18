import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
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
        display: 'flex',
        flexDirection: 'column',
        height: '90%',
        border: '1px solid grey',
    },
    questionlist: {
        flex: '1',
        overflowY: 'scroll',
        overflowX: 'hidden',
        padding: '0.5%'
    },
    panelNo: {
        flex: '0 0 50px'
    },
    panelTitle: {
        flex: '1 1 300px',
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
    selection: {
        display: 'flex',
        padding: '3px'
    },
    selectionScript: {
        width: '90%'
    },
    selectionSelection: {
        width: '80%'
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
        display: 'flex'
    },
}))(MuiExpansionPanelDetails);

class Test extends Component {

    constructor(props) {
        super(props)

        this.state = {
            questions: [],
            testbookId: 99999999
        }
    }

    componentDidMount() {
        this.getQuestisons()
    }

    /*
    addQuestion = (question) => {
        this.setState({
            ...this.state,
            questions: this.state.questionList.concat(question)
        })
    };
    handleExpandPanel = (i) => {
        const modifiedArray = this.state.questions.map((value, index) => {
            return index === i ? ({ ...value, expanded: !this.state.questions[i].expanded }) : value
        });

        this.setState({
            questions: modifiedArray
        });
    };
*/
    getQuestisons = () => {
        axios({
            method: 'get',
            url: '/api/book/' + this.state.testbookId + '/questions'
        }).then(res => {
            const list = res.data;
            console.log(list);
            this.setState({ questions: list })
        })
            .catch(err => console.log(err));
    }

    exportBookJson = (testbook) => {
        console.log(testbook);
        const link = document.createElement('a');
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(testbook));
        link.href = dataStr;
        link.download = "testbook.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.wrap}>
                <div className={classes.bookBody}>
                    <div className={classes.bookHeader}>
                        <BrowserRouter>
                            <Button className={classes.addBtn} onClick={() => this.exportBookJson(this.state.questions)}>Export</Button>
                            <Button className={classes.addBtn}>Clear</Button>
                            <Button className={classes.addBtn} onClick={() => this.props.history.push("/template", { addQuestion: "a" })} >Add</Button>
                        </BrowserRouter>
                    </div>
                    <div className={classes.bookContent}>
                        {this.state.questions ? this.state.questions.map((question, index) => {
                            return <div key={index} >{question.title}</div>
                        }) : ''}
                    </div>
                </div>
            </div>
        );
    }
    // order機能(保留)
    /*
      getQuestionOrder = () => {
          axios({
              method: 'get',
              url: '/api/book/' + this.state.testbookId + '/questionOrder'
          }).then(res => {
              this.setState({
                  ...this.state,
                  questionOrder: JSON.parse(res.data.question_order)
              
              })
          })
              .catch(err => console.log(err));
      }
  
      saveQuestionOrder = () => {
          const newQuestionOrder = [];
  
          this.state.questionSetList.forEach((question, index)=>{
              newQuestionOrder.push({order: index, questionId: question.question_id});
          });
  
          axios({
              method: 'post',
              url: '/api/book/' + this.state.testbookId + '/questionOrder',
              data: newQuestionOrder
          }).then(res => {
              console.log(res);
              if (res.data == "100" && res.status === 200) {
                  this.props.history.push("/test");
              }
          }).catch(err => console.log(err));
  
      }
      */

}

export default withStyles(styles)(Test);