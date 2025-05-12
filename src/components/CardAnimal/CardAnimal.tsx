import { Button, Flex } from 'antd';
import styled from 'styled-components';
import { DataObject } from '../GoogleSheets/GoogleSheetData';

function CardAnimal({ data }: { data: DataObject }) {
    return (
        <CardAnimalWrapper>
            {data.imageUrl && (
                <div className='card-image'>
                    <img src={data.imageUrl} alt={data.insectName} />
                </div>
            )}
            <div className='card-content'>
                <div>
                    <div className='content-title'>{data.insectName}</div>
                    <div className='content-detail'>
                        <div>
                            <span className='detail-label'>ชื่อสามัญ: </span>
                            <span className='detail-desc'>{data.commonName}</span>
                        </div>
                        <div>
                            <span className='detail-label'>ชื่อวิทยาศาสตร์: </span>
                            <span className='detail-desc'>{data.scientificName}</span>
                        </div>
                        <div>
                            <span className='detail-label'>วงศ์: </span>
                            <span className='detail-desc'>{data.family}</span>
                        </div>
                        <div>
                            <span className='detail-label'>สกุล: </span>
                            <span className='detail-desc'>{data.genus}</span>
                        </div>
                        <div>
                            <span className='detail-label'>ประเภท: </span>
                            <span className='detail-desc'>{data.type}</span>
                        </div>
                    </div>
                </div>
                <div className='content-footer'>
                    <Button variant='filled' danger color='primary'>
                        see
                    </Button>
                </div>
            </div>
        </CardAnimalWrapper>
    );
}

const CardAnimalWrapper = styled.div`
    position: relative;
    display: flex;
    width: 320px;
    height: 250px;
    border-radius: 10px;
    box-shadow: 0 0 10px #8b8b8bad;
    overflow: hidden;

    .card-image {
        min-width: 120px;
        width: 120px;
        height: 100%;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }
    }

    .card-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 12px;
        color: #ccc;
    }

    .content-footer {
        position: absolute;
        bottom: 12px;
        right: 12px;
    }

    .content-title {
        font-size: 16px;
        font-weight: 600;
        color: #000;
        margin-bottom: 12px;
    }

    .content-detail {
        color: #777;
        line-height: 1.8;

        .detail-desc {
            color: #000;
        }
    }
`;

export default CardAnimal;
