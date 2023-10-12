import React from 'react';
import { BsChevronDoubleLeft, BsChevronDoubleRight } from 'react-icons/bs';

const Pagination = ({ pageNumber, setPageNumber, totalItem, parPage, showItem }) => {

    const paginationBtn = {
        background: '#878787',
        color: '#fff',
        fontWeight: 600,
        padding: '5px 9px',
        borderRadius: '5px'
    }

    const activePage = {
        background: '#444',
        color: '#fff',
        fontWeight: 600,
        padding: '5px 12px',
        borderRadius: '5px'
    }

    const inActivePage = {
        background: '#878787',
        cursor: 'pointer',
        color: '#fff',
        fontWeight: 600,
        padding: '5px 12px',
        borderRadius: '5px'
    }


    let totalPage = Math.ceil(totalItem / parPage)
    let startPage = pageNumber;


    let dif = totalPage - pageNumber;

    if (dif <= showItem) {
        startPage = totalPage - showItem
    }
    let endPage = startPage < 0 ? showItem : showItem + startPage

    if (startPage <= 0) {
        startPage = 1
    }
    const createBtn = () => {
        const btns = []

        for (let i = startPage; i < endPage; i++) {
            btns.push(
                <li
                    key={i}
                    onClick={() => setPageNumber(i)}
                    style={pageNumber === i ? activePage : inActivePage}
                >
                    {i}
                </li>
            )
        }
        return btns
    }

    return (
        <ul style={{ display: 'flex', gap: 3, marginLeft: "-30px" }}>
            {
                pageNumber > 1 && <li onClick={() => setPageNumber(pageNumber - 1)} style={paginationBtn}>
                    <BsChevronDoubleLeft />
                </li>
            }
            {
                createBtn()
            }
            {
                pageNumber < totalPage && <li onClick={() => setPageNumber(pageNumber + 1)} style={paginationBtn}>
                    <BsChevronDoubleRight />
                </li>
            }
        </ul>
    )
}

export default Pagination;