import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { selectAllCreators, selectAllCreatorsStatus, selectCreatorsNextPage, selectCreatorsPrevPage } from '../../redux/store/creatorSlice';
import { useEffect, useState } from 'react';
import { fetchAsyncCreators } from '../../redux/utils/creatorUtils';
import { Title } from '../../components/common';
import GameCard from './GameCard';

// Updated backgroundImages array with titles and descriptions
const backgroundImages = [
    {
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScDuoOQeRx2aqKsSKu56WTgzAA71CVEpThSROKtsLs0imU5m5cXqLeev-PolGBPYUb7Vc&usqp=CAU',
        route: '/Palamolzhi/palamolzhi.html',
        title: 'Palamolzhi Game',
        description: 'A fun game to guess Tamil proverbs.'
    },
    {
        url: 'https://t4.ftcdn.net/jpg/02/32/89/97/360_F_232899739_lnA5KZ1ZqwhXnUB1U570dGHmoGKUUbl6.jpg',
        route: '/Thirukkural',
        title: 'Thirukkural Game',
        description: 'Explore the ancient Thirukkural in a fun way.'
    },
    {
        url: 'https://t4.ftcdn.net/jpg/05/14/06/45/360_F_514064573_7wskVRRp1Zu8bDEFqJAunnOeIASEzmEv.jpg',
        route: '/TamilRiddles/triddles.html',
        title: 'Tamil Riddles',
        description: 'Challenge yourself with intriguing Tamil riddles.'
    },
    {
        url: 'https://as1.ftcdn.net/v2/jpg/03/75/73/26/1000_F_375732663_ELnTdqBG2wxQBXt3li38eneT7wcSRnTV.jpg',
        route: '/TamilQuiz/tquiz.html',
        title: 'Tamil Quiz',
        description: 'Test your knowledge with a variety of Tamil quizzes.'
    },
    {
        url: 'https://www.shutterstock.com/image-vector/hands-playing-rock-paper-scissors-260nw-2187551809.jpg',
        route: '/RockPaperScissors/Rps.html',
        title: 'Rock Paper Scissors',
        description: 'Play the classic game of Rock, Paper, Scissors.'
    },
    {
        url: 'https://t4.ftcdn.net/jpg/02/54/27/93/360_F_254279365_jvkxXVv7NsL2D5rpRPaHQVi7eEbt4lWe.jpg',
        route: '/WordGame/word.html',
        title: 'Word Guessing Game',
        description: 'Guess the word by listening to clues.'
    },
    {
        url: 'https://images.squarespace-cdn.com/content/v1/60491aa0038a851c94c451dd/1615426798488-59TDHRY2HEDCVZQEMKXG/Multiplication+Squares+Game+Banner.JPG',
        route: '/Multiplication/multiplication.html',
        title: 'Multiplication Squares',
        description: 'Improve your multiplication skills with this engaging game.'
    },
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
                            return (
                                <GameCard
                                    key={index}
                                    title={image.title}  // Pass the title prop
                                    description={image.description}  // Pass the description prop
                                    backgroundImage={image.url}
                                    route={image.route}
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
