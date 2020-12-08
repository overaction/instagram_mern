import spin from './loading.gif';

const Loading = () => {
    return (
        <div style={{display: 'flex' ,justifyContent: 'center', marginTop: '50px'}}>
            <img src={spin} alt="Loading..." />
        </div>
    )
}

export default Loading
