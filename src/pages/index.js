import React, {Component} from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Icon, Input, Card, Modal, Button, Header, Statistic, Loader} from 'semantic-ui-react';
import {NetworkService} from './../lib/index'
import {NavLink} from 'react-router-dom'

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
            todayCount: 0,
            historyCount: 0,
            useAnalysis: true,
            analysisPlatform: '',
            checkPlatform: '',
            allExpress: []
        };
    };

    componentDidMount = () => {
        this.getCount();
    };

    getCount = () => {
        let vm = this;
        NetworkService.getCount().then(function (res) {
            if (res.code === 0) {
                vm.setState({
                    todayCount: parseInt(res.data.todayCount),
                    historyCount: parseInt(res.data.historyCount)
                })
            }
        })
    };

    analysisExpress = () => {
        const vm = this;
        if (!vm.state.checking && vm.state.logisticCode.length >= 6) {
            vm.setState({checking: true, traces: [], allExpress: [], useAnalysis: true});
            NetworkService.analysisExpress(vm.state.logisticCode).then(function (res) {
                if (res.code === 0) {
                    if (res.data.list.length <= 0) {
                        vm.setState({
                            modalOpen: true,
                            modalTitle: "解析失败",
                            modalContent: "无法找到该快递编号所属公司。"
                        })
                    } else {
                        vm.setState({
                            expressList: res.data.list,
                            analysisPlatform: res.data.platform
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
        NetworkService.checkExpress(vm.state.logisticCode, company_code, vm.state.useAnalysis, vm.state.analysisPlatform).then(function (res) {
            if (res.code === 0) {
                console.log(res.data);
                vm.setState({
                    traces : res.data.traces,
                    checkPlatform : res.data.platform,
                    expressList: [],
                    allExpress: [],
                    todayCount: parseInt(res.msg)
                })
            } else {
                vm.setState({
                    modalOpen: true,
                    modalTitle: "查询失败",
                    modalContent: res.msg,
                    todayCount: parseInt(res.data)
                })
            }
            vm.setState({checking: false});
        })
    };

    showExpressList = () => {
        let vm = this;
        NetworkService.getExpressList().then(function (res) {
            if (res.code === 0) {
                vm.setState({
                    expressList: [],
                    allExpress: res.data,
                    useAnalysis: false,
                    analysisPlatform: ''
                })
            }
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
                    <Card.Content key={vm.state.analysisPlatform==='KuaiDi100'?expressInfo.comCode:expressInfo.company_code + index} onClick={()=>vm.checkExpress(vm.state.analysisPlatform==='KuaiDi100'?expressInfo.comCode:expressInfo.company_code)} description={vm.state.analysisPlatform==='KuaiDi100'?expressInfo.comCode:expressInfo.company_name} />
                )
            });
            _expressList.push(
                <Card.Content style={{fontSize: 16}} onClick={()=>this.showExpressList()} header='选择其他' />
            );
        }
        return _expressList;
    };

    _renderAllExpressList = () => {
        let vm = this;
        let _expressList = [];
        if (vm.state.allExpress.length > 0) {
            _expressList.push(
                <Card.Content style={{height: 30, fontSize: 16, paddingTop: 5}} header='当前支持的全部快递' />
            );
            vm.state.allExpress.forEach(function (expressInfo, index) {
                _expressList.push(
                    <Card.Content key={expressInfo + index} onClick={()=>vm.checkExpress(expressInfo)} description={expressInfo} />
                )
            });
        }
        return _expressList;
    };

    _renderTracesCard = () => {
        let vm = this;
        let _traces = [];
        if (vm.state.traces.length > 0) {
            vm.state.traces.forEach(function (traceInfo) {
                _traces.push(
                    <Card.Content style={{textAlign:'left', padding: '5px 20px'}}>
                        <Card.Meta style={{fontSize:'16px'}}><Icon name='truck' style={{marginRight:10}} />{traceInfo.AcceptStation}</Card.Meta>
                        <Card.Description style={{fontSize:'14px', marginLeft:37}}>{traceInfo.AcceptTime}</Card.Description>
                    </Card.Content>
                )
            });
            _traces.push(
                <Card.Content style={{textAlign:'left', padding: '5px 20px'}}>
                    <Card.Meta style={{fontSize:'10px'}}><Icon name='info' style={{marginRight:10}} />&nbsp;&nbsp;&nbsp;【以上信息来源】{vm.state.checkPlatform}</Card.Meta>
                </Card.Content>
            );
        }
        return _traces;
    };

    handleClose = () => this.setState({ modalOpen: false });

    render() {
        return (
            <div className="App">
                <header className="App-header" style={{paddingBottom: 35, marginBottom:-40}}>
                    <h1>简单查</h1>
                    <Statistic.Group>
                        <Statistic color='green' style={{marginLeft:0}} inverted size='small'>
                            <Statistic.Label style={{fontSize: 15}}>累计服务</Statistic.Label>
                            <Statistic.Value>{this.state.historyCount + this.state.todayCount}<span style={{fontSize: 15}}>次</span></Statistic.Value>
                        </Statistic>
                        <Statistic color='green' inverted size='small'>
                            <Statistic.Label style={{fontSize: 15}}>今日服务</Statistic.Label>
                            <Statistic.Value>{this.state.todayCount}<span style={{fontSize: 15}}>次</span></Statistic.Value>
                        </Statistic>
                    </Statistic.Group>
                    <Input icon={<Icon name={this.state.checking?'crosshairs':'search'} loading={this.state.checking} onClick={()=>this.analysisExpress()} inverted circular link/>} placeholder='快递编号...'
                           onChange={(data)=>this.setState({logisticCode: data.target.value})} />
                    {this.state.expressList.length > 0 ? <Card size='mini' style={{marginBottom:10}}>{this._renderExpressList()}</Card>: ''}
                    {this.state.allExpress.length > 0 ? <Card size='mini' style={{marginBottom:10}}>{this._renderAllExpressList()}</Card>: ''}
                    {this.state.traces.length > 0 ? <Card style={{marginBottom:10, width:'80%'}}>
                        {this._renderTracesCard()}
                    </Card>:''}
                    <Modal
                        open={this.state.checking}
                        onClose={this.handleClose}
                        basic
                        size='small'
                    >
                        <Loader active={this.state.checking}/>
                    </Modal>
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
                <NavLink style={{fontSize:13}} exact to={'/rate'}>如使用中遇到任何问题请反馈</NavLink>
                <br/>
                <NavLink style={{fontSize:13}} exact to={'/datacentre'}>公开数据统计中心</NavLink>
            </div>
        );
    }
}
export default App;
