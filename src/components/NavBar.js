import React from 'react';
import '../css/Navbar.css'; // Update the CSS file path
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav className="nav-bar">
            <div className="logo">
                <Link className="logo-link" to="/AccuSport/">
                    <svg width="152" height="38" viewBox="0 0 152 38" fill="none" xmlns="http://www.w3.org/2000/svg">   
                        <rect width="152" height="38" fill="#0000" />
                        <g clipPath="url(#clip0_12_31)">
                            <rect width="5" height="19" transform="translate(9 15.5)" fill="white" />
                            <rect width="5" height="43" transform="translate(19 -8.5)" fill="white" />
                            <rect width="6" height="14" transform="translate(29 20.5)" fill="white" />
                        </g>
                        <path d="M53.8072 25.5H51.4165L55.7692 13.1364H58.5341L62.8928 25.5H60.5021L57.1999 15.6719H57.1033L53.8072 25.5ZM53.8857 20.6523H60.4055V22.4513H53.8857V20.6523ZM68.1871 25.6811C67.2615 25.6811 66.4666 25.4779 65.8026 25.0714C65.1425 24.6649 64.6334 24.1035 64.2752 23.3871C63.921 22.6667 63.744 21.8376 63.744 20.8999C63.744 19.9581 63.9251 19.127 64.2873 18.4066C64.6495 17.6822 65.1606 17.1187 65.8207 16.7163C66.4847 16.3098 67.2695 16.1065 68.1751 16.1065C68.9277 16.1065 69.5938 16.2454 70.1733 16.5231C70.7569 16.7968 71.2217 17.1851 71.5678 17.6882C71.9139 18.1873 72.1112 18.7708 72.1594 19.4389H70.0707C69.9862 18.9922 69.7849 18.6199 69.467 18.3221C69.1531 18.0202 68.7325 17.8693 68.2053 17.8693C67.7585 17.8693 67.3661 17.9901 67.0281 18.2315C66.69 18.469 66.4264 18.8111 66.2372 19.2578C66.0521 19.7045 65.9595 20.2398 65.9595 20.8636C65.9595 21.4955 66.0521 22.0388 66.2372 22.4936C66.4223 22.9444 66.6819 23.2925 67.016 23.538C67.354 23.7795 67.7505 23.9002 68.2053 23.9002C68.5272 23.9002 68.815 23.8398 69.0685 23.7191C69.3261 23.5943 69.5414 23.4152 69.7145 23.1818C69.8875 22.9484 70.0063 22.6647 70.0707 22.3306H72.1594C72.1071 22.9866 71.9139 23.5682 71.5799 24.0753C71.2459 24.5784 70.7911 24.9728 70.2156 25.2585C69.64 25.5402 68.9639 25.6811 68.1871 25.6811ZM77.9987 25.6811C77.073 25.6811 76.2781 25.4779 75.6141 25.0714C74.954 24.6649 74.4449 24.1035 74.0867 23.3871C73.7326 22.6667 73.5555 21.8376 73.5555 20.8999C73.5555 19.9581 73.7366 19.127 74.0988 18.4066C74.461 17.6822 74.9722 17.1187 75.6322 16.7163C76.2963 16.3098 77.0811 16.1065 77.9866 16.1065C78.7392 16.1065 79.4053 16.2454 79.9848 16.5231C80.5684 16.7968 81.0332 17.1851 81.3794 17.6882C81.7255 18.1873 81.9227 18.7708 81.971 19.4389H79.8822C79.7977 18.9922 79.5964 18.6199 79.2785 18.3221C78.9646 18.0202 78.544 17.8693 78.0168 17.8693C77.57 17.8693 77.1776 17.9901 76.8396 18.2315C76.5015 18.469 76.2379 18.8111 76.0487 19.2578C75.8636 19.7045 75.771 20.2398 75.771 20.8636C75.771 21.4955 75.8636 22.0388 76.0487 22.4936C76.2339 22.9444 76.4935 23.2925 76.8275 23.538C77.1656 23.7795 77.562 23.9002 78.0168 23.9002C78.3387 23.9002 78.6265 23.8398 78.8801 23.7191C79.1376 23.5943 79.353 23.4152 79.526 23.1818C79.6991 22.9484 79.8178 22.6647 79.8822 22.3306H81.971C81.9186 22.9866 81.7255 23.5682 81.3914 24.0753C81.0574 24.5784 80.6026 24.9728 80.0271 25.2585C79.4516 25.5402 78.7754 25.6811 77.9987 25.6811ZM89.6756 21.6001V16.2273H91.861V25.5H89.742V23.8519H89.6454C89.4361 24.3711 89.092 24.7957 88.6131 25.1257C88.1382 25.4557 87.5526 25.6207 86.8564 25.6207C86.2486 25.6207 85.7114 25.4859 85.2445 25.2163C84.7817 24.9426 84.4194 24.5462 84.1578 24.027C83.8962 23.5038 83.7654 22.8719 83.7654 22.1314V16.2273H85.9508V21.7933C85.9508 22.3809 86.1118 22.8478 86.4338 23.1939C86.7557 23.54 87.1783 23.7131 87.7015 23.7131C88.0235 23.7131 88.3354 23.6346 88.6373 23.4776C88.9391 23.3207 89.1866 23.0872 89.3798 22.7773C89.577 22.4634 89.6756 22.071 89.6756 21.6001ZM105.141 16.5352C105.084 16.0079 104.847 15.5974 104.428 15.3036C104.014 15.0098 103.475 14.8629 102.81 14.8629C102.344 14.8629 101.943 14.9334 101.609 15.0742C101.275 15.2151 101.02 15.4062 100.842 15.6477C100.665 15.8892 100.575 16.1649 100.571 16.4748C100.571 16.7324 100.629 16.9557 100.746 17.1449C100.867 17.334 101.03 17.495 101.235 17.6278C101.44 17.7566 101.667 17.8653 101.917 17.9538C102.167 18.0424 102.418 18.1168 102.672 18.1772L103.831 18.467C104.298 18.5756 104.746 18.7225 105.177 18.9077C105.612 19.0928 106 19.3262 106.342 19.608C106.688 19.8897 106.962 20.2298 107.163 20.6282C107.364 21.0266 107.465 21.4935 107.465 22.0288C107.465 22.7532 107.28 23.3911 106.91 23.9425C106.539 24.4898 106.004 24.9184 105.304 25.2283C104.607 25.5342 103.764 25.6871 102.774 25.6871C101.812 25.6871 100.977 25.5382 100.269 25.2404C99.5646 24.9426 99.0132 24.5079 98.6148 23.9364C98.2204 23.3649 98.0071 22.6687 97.9749 21.8477H100.178C100.211 22.2783 100.343 22.6365 100.577 22.9222C100.81 23.208 101.114 23.4213 101.488 23.5621C101.867 23.703 102.289 23.7734 102.756 23.7734C103.243 23.7734 103.67 23.701 104.036 23.5561C104.406 23.4072 104.696 23.2019 104.905 22.9403C105.115 22.6747 105.221 22.3648 105.225 22.0107C105.221 21.6887 105.127 21.4231 104.941 21.2138C104.756 21.0005 104.497 20.8234 104.163 20.6825C103.833 20.5376 103.446 20.4089 103.004 20.2962L101.597 19.9339C100.579 19.6723 99.7739 19.2759 99.1823 18.7447C98.5947 18.2094 98.3009 17.4991 98.3009 16.6136C98.3009 15.8852 98.4981 15.2473 98.8925 14.6999C99.2909 14.1526 99.8322 13.728 100.516 13.4261C101.201 13.1203 101.975 12.9673 102.841 12.9673C103.718 12.9673 104.487 13.1203 105.147 13.4261C105.811 13.728 106.332 14.1486 106.71 14.6879C107.089 15.2231 107.284 15.8389 107.296 16.5352H105.141ZM109.365 28.9773V16.2273H111.514V17.7607H111.641C111.754 17.5353 111.913 17.2958 112.118 17.0423C112.323 16.7847 112.601 16.5653 112.951 16.3842C113.301 16.1991 113.748 16.1065 114.291 16.1065C115.008 16.1065 115.654 16.2897 116.229 16.6559C116.809 17.0181 117.267 17.5554 117.605 18.2678C117.948 18.9761 118.119 19.8454 118.119 20.8757C118.119 21.8939 117.952 22.7592 117.618 23.4716C117.283 24.1839 116.829 24.7273 116.253 25.1016C115.678 25.4759 115.026 25.663 114.297 25.663C113.766 25.663 113.325 25.5745 112.975 25.3974C112.625 25.2203 112.343 25.007 112.13 24.7575C111.921 24.5039 111.758 24.2644 111.641 24.0391H111.55V28.9773H109.365ZM111.508 20.8636C111.508 21.4633 111.593 21.9885 111.762 22.4393C111.935 22.89 112.182 23.2422 112.504 23.4957C112.83 23.7453 113.225 23.87 113.688 23.87C114.17 23.87 114.575 23.7412 114.901 23.4837C115.227 23.2221 115.472 22.8659 115.637 22.4151C115.806 21.9603 115.891 21.4432 115.891 20.8636C115.891 20.2881 115.808 19.777 115.643 19.3303C115.478 18.8835 115.233 18.5334 114.907 18.2798C114.581 18.0263 114.174 17.8995 113.688 17.8995C113.221 17.8995 112.824 18.0223 112.498 18.2678C112.172 18.5133 111.925 18.8574 111.756 19.3001C111.591 19.7428 111.508 20.264 111.508 20.8636ZM124.035 25.6811C123.129 25.6811 122.344 25.4819 121.68 25.0835C121.016 24.685 120.501 24.1276 120.135 23.4112C119.773 22.6948 119.592 21.8577 119.592 20.8999C119.592 19.942 119.773 19.1029 120.135 18.3825C120.501 17.662 121.016 17.1026 121.68 16.7042C122.344 16.3058 123.129 16.1065 124.035 16.1065C124.94 16.1065 125.725 16.3058 126.389 16.7042C127.053 17.1026 127.566 17.662 127.929 18.3825C128.295 19.1029 128.478 19.942 128.478 20.8999C128.478 21.8577 128.295 22.6948 127.929 23.4112C127.566 24.1276 127.053 24.685 126.389 25.0835C125.725 25.4819 124.94 25.6811 124.035 25.6811ZM124.047 23.9304C124.538 23.9304 124.948 23.7956 125.278 23.5259C125.608 23.2522 125.854 22.886 126.015 22.4272C126.18 21.9684 126.262 21.4573 126.262 20.8938C126.262 20.3263 126.18 19.8132 126.015 19.3544C125.854 18.8916 125.608 18.5233 125.278 18.2496C124.948 17.976 124.538 17.8391 124.047 17.8391C123.544 17.8391 123.125 17.976 122.791 18.2496C122.461 18.5233 122.214 18.8916 122.049 19.3544C121.888 19.8132 121.807 20.3263 121.807 20.8938C121.807 21.4573 121.888 21.9684 122.049 22.4272C122.214 22.886 122.461 23.2522 122.791 23.5259C123.125 23.7956 123.544 23.9304 124.047 23.9304ZM130.333 25.5V16.2273H132.452V17.7727H132.548C132.717 17.2375 133.007 16.8249 133.418 16.5352C133.832 16.2414 134.305 16.0945 134.836 16.0945C134.957 16.0945 135.092 16.1005 135.241 16.1126C135.394 16.1206 135.521 16.1347 135.621 16.1548V18.1651C135.529 18.1329 135.382 18.1048 135.18 18.0806C134.983 18.0524 134.792 18.0384 134.607 18.0384C134.209 18.0384 133.85 18.1249 133.532 18.2979C133.218 18.467 132.971 18.7024 132.79 19.0043C132.609 19.3061 132.518 19.6542 132.518 20.0487V25.5H130.333ZM142.201 16.2273V17.9176H136.871V16.2273H142.201ZM138.187 14.0057H140.372V22.7109C140.372 23.0047 140.417 23.2301 140.505 23.3871C140.598 23.54 140.718 23.6446 140.867 23.701C141.016 23.7573 141.181 23.7855 141.362 23.7855C141.499 23.7855 141.624 23.7754 141.737 23.7553C141.853 23.7352 141.942 23.7171 142.002 23.701L142.37 25.4094C142.254 25.4497 142.087 25.494 141.869 25.5423C141.656 25.5906 141.395 25.6187 141.085 25.6268C140.537 25.6429 140.044 25.5604 139.606 25.3793C139.167 25.1941 138.819 24.9084 138.561 24.522C138.308 24.1357 138.183 23.6527 138.187 23.0732V14.0057Z" fill="white" />
                        <defs>
                            <clipPath id="clip0_12_31">
                                <rect width="33" height="31" fill="white" transform="translate(9 3.5)" />
                            </clipPath>
                        </defs>
                    </svg>
                </Link>
            </div>
            <ul className="nav-links">
                <li>
                    <Link className="nav-link" to="/teams">
                        Teams
                    </Link>
                </li>
                <li>
                    <Link className="nav-link" to="/tournaments">
                        Tournaments
                    </Link>
                </li>
                <li>
                    <Link className="nav-link" to="/matches">
                        Matches
                    </Link>
                </li>
                <li>
                    <Link className="nav-link" to="/players">
                        Players
                    </Link>
                </li>
                <li>
                    <Link className="nav-link" to="/betting">
                        Betting
                    </Link>
                </li>
                <li>
                    <Link className="nav-link" to="/login">
                        Login
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
