import React, {Component} from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import {Icon, Input, Card, Modal, Button, Header, Step, Dimmer, Loader, Statistic} from 'semantic-ui-react';
import {NetworkService} from './lib/index'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logisticCode: '',
            expressList: [],
            checking: false,
            modalOpen: false,
            modalTitle: '',
            modalContent: '',
            traces: [],
            todayCount: ''
        };
    };

    componentDidMount = () => {
        this.getTodayCount();
    };

    getTodayCount = () => {
        let vm = this;
        NetworkService.getTodayCount().then(function (res) {
            if (res.code === 0) {
                vm.setState({
                    todayCount: res.data
                })
            }
        })
    };

    analysisExpress = () => {
        const vm = this;
        if (vm.state.logisticCode.length >= 6) {
            vm.setState({checking: true, traces: []});
            console.log(vm.state.logisticCode);
            NetworkService.analysisExpress(vm.state.logisticCode).then(function (res) {
                console.log(res);
                if (res.code === 0) {
                    if (res.data.length <= 0) {
                        vm.setState({
                            modalOpen: true,
                            modalTitle: "解析失败",
                            modalContent: "无法找到该快递编号所属公司。"
                        })
                    } else {
                        vm.setState({
                            expressList: res.data
                        });
                    }
                } else {
                    vm.setState({
                        modalOpen: true,
                        modalTitle: "查询失败",
                        modalContent: res.msg
                    })
                }
                vm.setState({checking: false});
            })
        }
    };

    checkExpress = (company_code) => {
        let vm = this;
        vm.setState({checking: true});
        NetworkService.checkExpress(vm.state.logisticCode, company_code).then(function (res) {
            if (res.code === 0) {
                console.log(res);
                vm.setState({
                    traces : res.data.traces,
                    expressList: [],
                    todayCount: res.msg
                })
            } else {
                vm.setState({
                    modalOpen: true,
                    modalTitle: "查询失败",
                    modalContent: res.msg,
                    todayCount: res.data
                })
            }
            vm.setState({checking: false});
        })
    };

    _renderExpressList = () => {
        let vm = this;
        let _expressList = [];
        if (vm.state.expressList.length > 0) {
            _expressList.push(
                <Card.Content style={{height: 30, fontSize: 16, paddingTop: 5}} header='系统识别结果' />
            );
            vm.state.expressList.forEach(function (expressInfo, index) {
                _expressList.push(
                    <Card.Content key={expressInfo.company_code + index} onClick={()=>vm.checkExpress(expressInfo.company_code)} description={expressInfo.company_name} />
                )
            });
        }
        return _expressList;
    };

    _renderTraces = () => {
        let vm = this;
        let _traces = [];
        if (vm.state.traces.length > 0) {
            vm.state.traces.forEach(function (traceInfo, index) {
                _traces.push(
                    <Step style={{height: 70, textAlign:'left', lineHeight:2}}>
                        <Icon name='truck' />
                        <Step.Content>
                            <Step.Title>{traceInfo.AcceptStation}</Step.Title>
                            <Step.Description style={{marginLeft:0}}>{traceInfo.AcceptTime}</Step.Description>
                        </Step.Content>
                    </Step>
                )
            })
        }
        return _traces;
    };

    handleClose = () => this.setState({ modalOpen: false });

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1>简单查</h1>
                    <Statistic color='green' inverted size='small'>
                        <Statistic.Label style={{fontSize: 15}}>今日服务</Statistic.Label>
                        <Statistic.Value>{this.state.todayCount}<span style={{fontSize: 15}}>次</span></Statistic.Value>
                    </Statistic>
                    <Input icon={<Icon name={this.state.checking?'crosshairs':'search'} loading={this.state.checking} onClick={()=>this.analysisExpress()} inverted circular link/>} placeholder='快递编号...'
                           onChange={(data)=>this.setState({logisticCode: data.target.value})} />
                    {this.state.expressList.length > 0 ? <Card style={{marginBottom:10, minWidth:300}}>{this._renderExpressList()}</Card>: ''}
                    <Dimmer active={this.state.checking}>
                        <Loader content='Loading' />
                    </Dimmer>
                    <Step.Group vertical size='mini'>
                        {this._renderTraces()}
                    </Step.Group>
                    <Modal
                        open={this.state.modalOpen}
                        onClose={this.handleClose}
                        basic
                        size='small'
                    >
                        <Header icon='browser' content={this.state.modalTitle} />
                        <Modal.Content>
                            <h3>{this.state.modalContent}</h3>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='green' onClick={this.handleClose} inverted>
                                <Icon name='checkmark' /> Got it
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </header>
            </div>
        );
    }
}
export default App;
