// File: src/views/creator/CreatorAllPage.jsx
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { selectAllCreators, selectAllCreatorsStatus, selectCreatorsNextPage, selectCreatorsPrevPage } from '../../redux/store/creatorSlice';
import { useEffect, useState } from 'react';
import { fetchAsyncCreators } from '../../redux/utils/creatorUtils';
import { Title } from '../../components/common';
import GameCard from './GameCard';

const backgroundImages = [
    {url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScDuoOQeRx2aqKsSKu56WTgzAA71CVEpThSROKtsLs0imU5m5cXqLeev-PolGBPYUb7Vc&usqp=CAU', route: '/Palamolzhi/palamolzhi.html'},
    {url: 'https://t4.ftcdn.net/jpg/02/32/89/97/360_F_232899739_lnA5KZ1ZqwhXnUB1U570dGHmoGKUUbl6.jpg', route: '/Thirukkural'},
    {url: 'https://t4.ftcdn.net/jpg/05/14/06/45/360_F_514064573_7wskVRRp1Zu8bDEFqJAunnOeIASEzmEv.jpg', route: '/TamilRiddles/triddles.html'},
    {url: 'https://as1.ftcdn.net/v2/jpg/03/75/73/26/1000_F_375732663_ELnTdqBG2wxQBXt3li38eneT7wcSRnTV.jpg', route: '/TamilQuiz/tquiz.html'},
    {url: 'https://www.shutterstock.com/image-vector/hands-playing-rock-paper-scissors-260nw-2187551809.jpg', route: '/RockPaperScissors/Rps.html'},
    {url: 'https://t4.ftcdn.net/jpg/02/54/27/93/360_F_254279365_jvkxXVv7NsL2D5rpRPaHQVi7eEbt4lWe.jpg', route: '/WordGame/word.html'},
    {url: 'https://images.squarespace-cdn.com/content/v1/60491aa0038a851c94c451dd/1615426798488-59TDHRY2HEDCVZQEMKXG/Multiplication+Squares+Game+Banner.JPG', route: '/Multiplication/multiplication.html'},
];

const CreatorAllPage = () => {
    const dispatch = useDispatch();
    const creators = useSelector(selectAllCreators);
    const creatorsStatus = useSelector(selectAllCreatorsStatus);
    const nextPage = useSelector(selectCreatorsNextPage);
    const prevPage = useSelector(selectCreatorsPrevPage);
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(fetchAsyncCreators(page));
    }, [dispatch, page]);

    const pageHandler = (pageValue) => setPage(pageValue);

    return (
        <CreatorAllPageWrapper>
            <div className='sc-creators section'>
                <div className='container'>
                    <Title titleName={{
                        firstText: "OUR",
                        secondText: "GAMES"
                    }} />
                    <GameCardsWrapper>
                        {backgroundImages.map((image, index) => {
                            const backgroundImage = typeof image === 'string' ? image : image.url;
                            const route = typeof image === 'string' ? `/card${index + 1}` : image.route;
                            return (
                                <GameCard
                                    key={index}
                                    title={`Game ${index + 1}`}
                                    description={`Description for game ${index + 1}`}
                                    backgroundImage={backgroundImage}
                                    route={route}
                                />
                            );
                        })}
                    </GameCardsWrapper>
                </div>
            </div>
        </CreatorAllPageWrapper>
    )
}

export default CreatorAllPage;

const CreatorAllPageWrapper = styled.div`
    background-color: var(--clr-violet-dark-active);
    .sc-creators {
        min-height: 100vh;
        padding-top: 65px;
    }
`;

const GameCardsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 20px;
`;
