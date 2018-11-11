import React, {Component} from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Rating, Form, TextArea, Input, Icon, Button, Header, Modal} from 'semantic-ui-react'
import {NetworkService} from './../../lib/index'


class Rate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            email: '',
            stars: 1,
            showModel: false,
            modalContent: ''
        };
    };

    handleRate = (e, { rating }) => {
        console.log(rating);
        this.setState({ stars: rating });
    };

    submit = () => {
        let vm = this;
        NetworkService.rate(vm.state.message, vm.state.email, vm.state.stars).then(function (res) {
            if (res.code === 0) {
                vm.setState({
                    showModel: true,
                    modalContent: '提交成功'
                })
            } else {
                vm.setState({
                    showModel: true,
                    modalContent: '提交失败'
                })
            }
        })
    };

    cancel = () => {
        this.props.history.goBack();
    };

    handleClose = () => this.setState({ showModel: false, modalContent: '' });

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1>评价与反馈</h1>
                    <br/>
                    <Rating icon='heart' size={'huge'} onRate={this.handleRate} defaultRating={1} maxRating={5} />
                    <br/>
                    <Form style={{width:370}}>
                        <TextArea autoHeight onChange={(data)=>this.setState({message: data.target.value})} style={{width:'100%', border:'1px solid red'}} placeholder='请留下您的建议或意见' />
                    </Form>
                    <br/>
                    <Input style={{width:370}} onChange={(data)=>this.setState({email: data.target.value})} iconPosition='left' size={'mini'} placeholder='留下您的邮箱方便我与您取得联系（非必须）'>
                        <Icon style={{color: 'red', marginLeft:-6}} name='at' />
                        <input style={{border:'1px solid red', fontSize:14}} />
                    </Input>
                    <br/>
                    <Button onClick={()=>this.submit()} inverted color='red' content={'提交'}/>
                    <br/>
                    <Button onClick={()=>this.cancel()} inverted color='brown' content={'返回'}/>
                </header>
                <Modal
                    open={this.state.showModel}
                    onClose={this.handleClose}
                    basic
                    size='small'
                >
                    <Header icon='browser' />
                    <Modal.Content>
                        <h3>{this.state.modalContent}</h3>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='green' onClick={this.handleClose} inverted>
                            <Icon name='checkmark' /> Got it
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}
export default Rate;
