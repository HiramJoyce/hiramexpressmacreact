import React, {Component} from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Menu, Container, Header, Icon, Grid} from 'semantic-ui-react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/sunburst';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: 'byDate'
        };
    };

    componentDidMount() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('main'));
        // 绘制图表
        myChart.setOption({
            title: {text: '历史查询统计'},
            tooltip: {},
            xAxis: {
                data: ["2018-11-08", "2018-11-09", "2018-11-10", "2018-11-11", "2018-11-12"]
            },
            yAxis: {},
            series: [{
                name: '查询次数',
                type: 'line',
                data: [163, 87, 101, 34, 22],
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
        let myChart2 = echarts.init(document.getElementById('main2'));
        // 绘制图表
        myChart2.setOption({
            tooltip: {},
            series: [{
                type: 'sunburst',
                data: [
                    {
                        name: '成功',
                        value: 1,
                        children: [
                            {name: 'YTO', value: 1}
                        ]
                    }, {
                        name: '失败',
                        value: 11,
                        children: [{
                            name: '未收录快递公司',
                            value: 4
                        }, {
                            name: '无数据',
                            value: 7,
                            children: [
                                {name: 'JD', value: 3},
                                {name: 'TNT', value: 1},
                                {name: 'BEL', value: 1},
                                {name: 'UPS', value: 1},
                                {name: 'DHL', value: 1}
                            ]
                        }]
                    }
                ]
            }]
        });
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
                        Admin Charts
                        <Header.Subheader>Manage your preferences</Header.Subheader>
                    </Header.Content>
                </Header>
                <br/>
                <Grid>
                    <Grid.Column width={4}>
                        <Menu pointing secondary vertical>
                            <Menu.Item name='byDate' active={activeItem === 'byDate'} onClick={this.handleItemClick}>
                                查询统计
                            </Menu.Item>
                        </Menu>
                    </Grid.Column>

                    <Grid.Column width={12}>
                        <Grid>
                            <Grid.Row columns={2}>
                                <Grid.Column width={6}>
                                    <div id={'main'} style={{width: 300, height: 300}}></div>
                                </Grid.Column>
                                <Grid.Column width={6} style={{marginLeft: 20}}>
                                    <div id={'main2'} style={{width: 300, height: 300}}></div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}

export default Admin;
