import React, { Component } from 'react';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

class TestViewer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            questions: null,
            markingSheet: null,
            nowQuestionIdx: 0,
        }
    }

    componentDidMount() {
        this.getQuestions()
    }

    render() {
        if (this.state.questions === null) {
            return <Typography>please wait</Typography>
        }

        const { scripts, subQuestions } = this.state.questions[this.state.nowQuestionIdx];
        const { classes } = this.props;

        return (
            <div className={classes.wrap}>
                <div className={classes.body}>
                    <div className={classes.contents}>
                        <div className={classes.script}>
                            {scripts ? scripts.map((script, index) => {
                                return (
                                    <div className={classes.scriptItem} key={index}>
                                        <div className={classes.scriptTitle}>
                                            <Typography variant="subtitle1" gutterBottom>{script.subtilte}</Typography>
                                        </div>
                                        <div className={classes.scriptContents}>
                                            <Typography style={{ wordBreak: 'break-all' }} gutterBottom>{script.contents}</Typography>
                                        </div>
                                    </div>
                                )
                            })
                                : {}}
                        </div>
                        <div className={classes.subQuestion}>
                            {subQuestions ? subQuestions.map((subQuestion, subQuestionIdx) => {
                                return (
                                    <div className={classes.subQuestionItem} key={subQuestionIdx}>
                                        <div style={{ marginLeft: 15 }}>
                                            <Typography variant="subtitle1">Q{subQuestionIdx + 1}.{subQuestion.subtilte}</Typography>
                                        </div>
                                        <Divider variant="middle" />
                                        <div className={classes.selection}>
                                            {subQuestion.selections.map((selection, selectionIdx) => {
                                                const isChecked = this.state.markingSheet[subQuestion.subQuestionNo].has(selection.id)
                                                return (
                                                    <div className={classes.selectionItem}
                                                        key={selectionIdx}
                                                        onClick={() => this.handleMarking(subQuestion.selectionType, subQuestion.subQuestionNo, selection.id, subQuestion.answer.length)}
                                                        style={isChecked? {backgroundColor: '#F0F6ED'} : null }
                                                    >
                                                        <Checkbox
                                                            checked={isChecked}
                                                        />
                                                        <div>
                                                            <Typography gutterBottom>
                                                                {selection.text}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })
                                : {}}
                        </div>
                    </div>
                    <div className={classes.footer}>
                        <div onClick={this.prevQuestion}>
                            <Button>prev</Button>
                        </div>
                        {
                            this.state.nowQuestionIdx === this.state.questions.length - 1 ?
                                <div onClick={() => this.checkCompleteTest()}>
                                    <Button>submit</Button>
                                </div> :
                                <div onClick={this.nextQuestion}>
                                    <Button>next</Button>
                                </div>
                        }
                    </div>
                </div>
            </div>
        );
    }

    // functions

    getQuestions = () => {

        const bookId = this.props.location.state.bookId

        axios({
            method: 'get',
            url: '/api/testbook/' + bookId
        }).then(res => {
            console.log(res.data);
            this.setTestingState(res.data);
        })
            .catch(err => console.log(err));
    }

    goToQuestion = (index) => {

        let targetQuestionIdx = -1;

        this.state.questions.forEach((question, questionIdx) => {
            question.subQuestions.forEach((subQuestion) => {
                if (subQuestion.subQuestionNo === index) {
                    targetQuestionIdx = questionIdx;
                }
            })
        })

        this.setState({
            ...this.state,
            modalVisible: !this.state.modalVisible,
            nowQuestionIdx: targetQuestionIdx
        })
    }

    checkCompleteTest = () => {
        let result = true
        this.state.markingSheet.forEach((data) => {
            if (data.size === 0) {
                result = false;
                return;
            }
        })
        if (result) {
            this.submitTest();
        }
    }

    prevQuestion = (event) => {
        event.stopPropagation();
        if (this.state.nowQuestionIdx > 0) {
            let newQuestionIdx = this.state.nowQuestionIdx - 1;
            this.setState({
                ...this.state,
                nowQuestionIdx: newQuestionIdx
            })
        }
    }

    nextQuestion = (event) => {
        event.stopPropagation();
        if (this.state.nowQuestionIdx < this.state.questions.length - 1) {
            let newQuestionIdx = this.state.nowQuestionIdx + 1;
            this.setState({
                ...this.state,
                nowQuestionIdx: newQuestionIdx
            })
        }
    }

    // 테스트 준비 상태 세팅
    setTestingState = async (questions) => {

        if (questions.length === 0) return;

        let subQuestionNo = 0;
        // 서브퀘스트에 questionNo부여
        const newQuestions = questions.map((question) => {
            const newSubQuestion = question.subQuestions.map((subQuestion) => {
                const newSubQuestion = {
                    ...subQuestion,
                    subQuestionNo: subQuestionNo
                }
                subQuestionNo = subQuestionNo + 1;
                return newSubQuestion;
            });
            const newQuestion = {
                ...question,
                subQuestions: newSubQuestion
            }

            return newQuestion;
        });

        // 서브퀘스트 수만큼 답안시트 작성
        const newMarkingSheet = []
        for (let index = 0; index < subQuestionNo; index++) {
            newMarkingSheet.push(new Set());
        }

        await this.setState({
            ...this.state,
            questions: newQuestions,
            markingSheet: newMarkingSheet,
            updated: true
        });
    }

    handleMarking = (selectionType, subQuestionNo, selectionId, answerCnt) => {

        let newMarkingSheet = this.state.markingSheet;

        switch (selectionType) {
            // 답선택수 제한 없음
            case 0: {

                newMarkingSheet[subQuestionNo].has(selectionId) ? newMarkingSheet[subQuestionNo].delete(selectionId) : newMarkingSheet[subQuestionNo].add(selectionId);

                this.setState({
                    ...this.state,
                    markingSheet: newMarkingSheet
                })
                return
            }
            // 1개의 답선택가능
            case 1: {
                if (newMarkingSheet[subQuestionNo].has(selectionId)) {
                    newMarkingSheet[subQuestionNo].clear();
                } else {
                    newMarkingSheet[subQuestionNo].clear();
                    newMarkingSheet[subQuestionNo].add(selectionId);
                }

                this.setState({
                    ...this.state,
                    markingSheet: newMarkingSheet
                })
                return
            }
            // 정답수만큼 답선택가능
            case 2: {
                if (newMarkingSheet[subQuestionNo].has(selectionId)) {
                    newMarkingSheet[subQuestionNo].delete(selectionId)
                } else {
                    if (newMarkingSheet[subQuestionNo].size >= answerCnt) {
                        return
                    }
                    newMarkingSheet[subQuestionNo].add(selectionId);
                }

                this.setState({
                    ...this.state,
                    markingSheet: newMarkingSheet
                })
                return
            }
            default:
                return
        }
    }

    confirmMarking = (subQuestionNo, selectionId) => {
        return this.state.markingSheet[subQuestionNo].has(selectionId);
    }

    submitTest = () => {

        const results = this.setResult();

        let correctCnt = 0;
        let incorrectCnt = 0;

        results.forEach((data) => {
            data.isAnswer ? correctCnt = correctCnt + 1 : incorrectCnt = incorrectCnt + 1
        })

        this.props.history.push({
            pathname: "/testbook/result",
            state: {
                bookId: this.props.location.state.bookId,
                results: results,
                correctCnt: correctCnt,
                incorrectCnt: incorrectCnt
            }
        });

    }

    setResult = () => {

        const results = [];

        this.state.questions.forEach((question, questionIdx) => {
            question.subQuestions.forEach((subQuestion) => {
                let isAnswer = true;
                if (this.state.markingSheet[subQuestion.subQuestionNo].size === subQuestion.answer.length) {
                    this.state.markingSheet[subQuestion.subQuestionNo].forEach((value) => {
                        if (!subQuestion.answer.includes(value)) {
                            isAnswer = false;
                        }
                    })
                } else {
                    isAnswer = false;
                }

                const answerIdx = subQuestion.answer;
                const markingIdx = [...this.state.markingSheet[subQuestion.subQuestionNo]];

                results.push({ questionId: question.question_id, subQuestionNo: subQuestion.subQuestionNo, answer: answerIdx.sort(), marking: markingIdx.sort(), isAnswer: isAnswer })
            })
        })

        return results;
    }

    // function End
}

const styles = theme => ({
    wrap: {
        display: 'flex'
    },
    body: {
        flex: '0 1 1280px',
        margin: '0 auto',
        minWidth: 320
    },
    contents: {
        padding: 10
    },
    script: {

    },
    scriptItem: {
        backgroundColor: 'white',
        margin: 5,
        borderRadius: 5
    },
    scriptTitle: {
        marginLeft: 5
    },
    scriptContents: {
        padding: '10px 15px',
        border: '0.5px solid #c0c0c0',
        borderRadius: 5,
        backgroundColor: '#D9EAD9',
    },
    subQuestionItem: {
        backgroundColor: 'white',
        margin: 3,
    },
    selection: {
        padding: '7px 12px'
    },
    selectionItem: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#E5F5FB',
        borderRadius: 5,
        margin: 5,
        cursor: 'pointer',
        "&:hover ": {
            backgroundColor: "#B7C4C9"
        },
        "&:active": {
            transform: "translateY(3px)"
        }
    },
    footer: {
        display: 'flex',
        position: 'fixed',
        height: '48px',
        width: '100%',
        bottom: 0,
        left: 0,
        backgroundColor: 'navajowhite',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default withStyles(styles)(TestViewer);