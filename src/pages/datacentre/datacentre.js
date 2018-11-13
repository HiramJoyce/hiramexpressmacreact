import React, {Component} from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Menu, Container, Header, Icon, Grid} from 'semantic-ui-react';
import {NetworkService} from './../../lib/index'
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/sunburst';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

class Datacentre extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: 'byDate',
            recordXAxisData: [],
            recordSeriesData: [],
            checkRecordSeriesData: []
        };
    };

    componentDidMount() {
        this.getStatistics();
    }

    getStatistics = () => {
        let vm = this;
        NetworkService.getStatistics().then(function (res) {
            if (res.code === 0) {
                if (res.data.record !== null) {
                    vm.setState({
                        recordXAxisData: res.data.record.xAxisData,
                        recordSeriesData: res.data.record.seriesData
                    })
                    let myChart = echarts.init(document.getElementById('main'));
                    myChart.setOption({
                        title: {text: '历史查询统计'},
                        tooltip: {},
                        xAxis: {
                            data: res.data.record.xAxisData,
                        },
                        yAxis: {},
                        series: [{
                            name: '查询次数',
                            type: 'line',
                            data: res.data.record.seriesData,
                            // symbol: 'triangle',
                            symbolSize: 8,
                            lineStyle: {
                                normal: {
                                    color: 'green',
                                    width: 2,
                                    type: 'dashed'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 2,
                                    borderColor: 'blue',
                                    // color: 'blue'
                                }
                            }
                        }]
                    });
                }
                if (res.data.checkRecord !== null) {
                    vm.setState({
                        checkRecordSeriesData: res.data.checkRecord.seriesData
                    })
                    let myChart2 = echarts.init(document.getElementById('main2'));
                    myChart2.setOption({
                        tooltip: {},
                        series: [{
                            type: 'sunburst',
                            data: res.data.checkRecord
                        }]
                    });
                }
            }
        })
    }

    handleItemClick = (e, {name}) => this.setState({activeItem: name});

    render() {
        const {activeItem} = this.state;
        return (
            <Container>
                <br/>
                <Header as='h1'>
                    <Icon name='th list'/>
                    <Header.Content>
                        简单查数据统计中心
                        <Header.Subheader>数据统计系统正在不断完善中...</Header.Subheader>
                    </Header.Content>
                </Header>
                <br/>
                <Grid>
                    {/*<Grid.Column width={4}>*/}
                        {/*<Menu pointing secondary vertical>*/}
                            {/*<Menu.Item name='byDate' active={activeItem === 'byDate'} onClick={this.handleItemClick}>*/}
                                {/*查询统计*/}
                            {/*</Menu.Item>*/}
                        {/*</Menu>*/}
                    {/*</Grid.Column>*/}

                    {/*<Grid.Column width={12} style={{alignItems:'center'}}>*/}
                        {/*<Grid>*/}
                            <Grid.Row>
                                <Grid.Column>
                                    <div id={'main'} style={{width: 600, height: 300, margin:'auto'}}></div>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>
                                    <div id={'main2'} style={{width: 600, height: 500, margin:'auto'}}></div>
                                </Grid.Column>
                            </Grid.Row>
                        {/*</Grid>*/}
                    {/*</Grid.Column>*/}
                </Grid>
            </Container>
        );
    }
}

export default Datacentre;
