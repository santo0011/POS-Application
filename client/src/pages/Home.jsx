import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import Chart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { get_amount } from '../store/Reducers/invoiceReducer';
import "./bill.scss";


const Home = () => {

    const dispatch = useDispatch();

    const [selectedMonth, setSelectedMonth] = useState();
    const [selectedYear, setSelectedYear] = useState();

    const [monthLength, setMonthLength] = useState();

    const { totalAmountPerDay, totalAmount } = useSelector(state => state.invoice);


    const state = {
        series: [
            {
                name: "Selas",
                data: totalAmountPerDay
            },
        ],
        options: {
            color: ['#181ee8', '#181ee8'],
            plotOptions: {
                radius: 30
            },
            chart: {
                background: 'transparent',
                foreColor: '#d0d2d6'
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                curve: ['smooth', 'straight', 'stepline'],
                lineCap: 'butt',
                colors: '#f0f0f0',
                width: 0.5,
                dashArray: 0
            },
            xaxis: {
                categories: Array.from({ length: monthLength }, (_, i) => (i + 1).toString())
            },
            legend: {
                position: 'top'
            },
            responsive: [
                {
                    breakpoint: 565,
                    yaxis: {
                        categories: Array.from({ length: monthLength }, (_, i) => (i + 1).toString())
                    },
                    options: {
                        plotOptions: {
                            bar: {
                                horizontal: true
                            }
                        },
                        chart: {
                            height: '550px'
                        }
                    }
                }
            ]
        }   
    };


    // 
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const years = [
        '2021', '2022', '2023',
        '2024', '2025', '2026'
    ];



    useEffect(() => {
        const currentDate = new Date();

        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        setSelectedMonth(month)
        setSelectedYear(year)

    }, [])



    // calculate month length
    useEffect(() => {
        function getDaysInMonth(month, year) {
            return new Date(year, month, 0).getDate();
        }
        const daysInJanuary = getDaysInMonth(selectedMonth, selectedYear);
        setMonthLength(daysInJanuary)

    }, [selectedMonth, selectedYear])


    useEffect(() => {
        const obj = {
            year: parseInt(selectedYear),
            month: parseInt(selectedMonth),
            monthLength: parseInt(monthLength)
        }
        dispatch(get_amount(obj))
    }, [selectedMonth, selectedYear, monthLength])


    return (
        <Layout>
            <div className="card m-4">
                <div className="mx-2 mt-3 d-flex">
                    <div className='selectMonth'>
                        <label className="form-label">Select Month : </label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        >
                            {months?.map((month, index) => (
                                <option key={index} value={index + 1}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='selectYear'>
                        <label>Select Year : </label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                        >
                            {years?.map((year, index) => (
                                <option key={index} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='chartAmount'>
                        <p> Amount : <span>₹ {totalAmount}</span></p>
                    </div>
                </div>

                <Chart options={state.options} series={state.series} type='bar' height={350} />
            </div>
        </Layout>
    );
};


export default Home;
