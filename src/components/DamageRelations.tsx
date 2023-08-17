import React, { useEffect, useState } from 'react'
import Type from './Type';
import { DamageRelations as DamageRelationsProps } from '../types/DamageRelationOfPokemonTypes';
import { Damage, DamageFromAndTo, SeparateDamages } from '../types/SeparateDamageRelations';

interface DamageModalProps {
    damages: DamageRelationsProps[];
}

interface Info {
    name: string;
    url: string;
}


const DamageRelations = ({ damages }: DamageModalProps) => {

    const [damagePokemonForm, setDamagePokemonForm] = useState<SeparateDamages>();
    useEffect(() => {

        const arrayDamage = damages.map((damage) =>
            separateObjectBetweenToAndFrom(damage))

        if (arrayDamage.length === 2) {   //속성이 두 개라면 
            // 합치는 부분
            const obj = joinDamageRelations(arrayDamage);
            setDamagePokemonForm(reduceDuplicateValues(postDamageValue(obj.from)));
        } else {  //속성이 한 개라면
            console.log(JSON.stringify(postDamageValue(arrayDamage[0].from)));
            setDamagePokemonForm(postDamageValue(arrayDamage[0].from));
        }

    }, [damages])

    const joinDamageRelations = (props: DamageFromAndTo[]): DamageFromAndTo => {
        return {
            to: joinObjects(props, 'to'),
            from: joinObjects(props, 'from')
        }
    }

    const reduceDuplicateValues = (props: SeparateDamages) => {

        const duplicateValues = {
            double_damage: '4x',
            half_damage: '1/4x',
            no_damage: '0x'
        }

        return Object.entries(props)
            .reduce((acc, [keyName, value]) => {
                const key = keyName as keyof typeof props;
                // console.log([keyName, value]);

                const verifiedValue = filterForUniqueValues(
                    value,
                    duplicateValues[key]
                )

                return (acc = { [keyName]: verifiedValue, ...acc });
            }, {})
    }

    const filterForUniqueValues = (valueForFiltering: Damage[], damageValue: string) => {

        const initialArray: Damage[] = [];

        return valueForFiltering.reduce((acc, currentValue) => {
            const { url, name } = currentValue;

            const filterACC = acc.filter((a) => a.name !== name);   //이름이 같으면 없애줌 =같지 않은것만 필터링

            return filterACC.length === acc.length
                ? (acc = [currentValue, ...acc])
                : (acc = [{ damageValue: damageValue, name, url }, ...filterACC])
        }, initialArray)

    }


    const joinObjects = (props: DamageFromAndTo[], string: string) => {

        const key = string as keyof typeof props[0];
        const firstArrayValue = props[0][key];
        const secondArrayValue = props[1][key];

        const result = Object.entries(secondArrayValue)  
            .reduce((acc, [keyName, value]: [string, Damage]) => {  
                // console.log(acc, [keyName, value]);
                const key = keyName as keyof typeof firstArrayValue;
                const result = firstArrayValue[key]?.concat(value);

                return (acc = { [keyName]: result, ...acc })

            }, {})

        return result;

    }

    const postDamageValue = (props: SeparateDamages): SeparateDamages => {
        const result = Object.entries(props)
            .reduce((acc, [keyName, value]) => {

                const key = keyName as keyof typeof props;

                const valuesOfKeyName = {
                    double_damage: '2x',
                    half_damage: '1/2x',
                    no_damage: '0x'
                };


                return (acc = {
                    [keyName]: value.map((i: Info[]) => ({
                        damageValue: valuesOfKeyName[key],
                        ...i   //최종적으로 {damageValue:값, name:값, url:값} 이렇게 나옴. 현재는 damageValue 값 하나만 나옴. 밑에 ...acc를 거쳐야 각 damageValue 값이 나옴 
                    })),
                    ...acc
                })
            }, {})

        return result;
    }


    const separateObjectBetweenToAndFrom = (damage: DamageRelationsProps): DamageFromAndTo => {   //damage 데이터에서 from(영향을 받는 속성)과 to(영향을 주는 속성)을 나눠서 각각 변수에 담음
        const from = filterDamageRelations('_from', damage);
        const to = filterDamageRelations('_to', damage);

        return { from, to };
    }

    const filterDamageRelations = (valueFilter: string, damage: DamageRelationsProps) => {
        const result: SeparateDamages = Object.entries(damage)   //객체를 키, 값을 담은 배열로 반환 [[키, 값],[키, 값]]
            .filter(([keyName, _]) => {
                return keyName.includes(valueFilter);  //keyName이 valueFilter(전달받은 to나 from)를 포함하고 있는것만 리턴 
            })
            .reduce((acc, [keyName, value]): SeparateDamages => {    //reduce : acc인자값에  반환값을 누적함

                const keyWithValueFilterRemove = keyName.replace(  //keyName 단어 안에서 _from이나 _to가 들어가있으면 없앰
                    valueFilter,
                    ''
                )

                return (acc = { [keyWithValueFilterRemove]: value, ...acc })  // 출력 : [keyWithValueFilterRemove]의 값+':'+value값+ acc의 내부 요소들
            }, {})

        return result;
    }


    return (
        <div className="flex gap-2 flex-col w-full">
            {damagePokemonForm ? (
                <>
                    {Object.entries(damagePokemonForm)
                        .map(([keyName, value]: [string, Damage[]]) => {
                            const key = keyName as keyof typeof damagePokemonForm;
                            const valuesOfKeyName = {
                                double_damage: 'Weak',
                                half_damage: 'Resistant',
                                no_damage: 'Immune'
                            }

                            return (
                                <div key={key}>
                                    <h3 className=" capitalize font-medium text-sm md:text-base 
                                                    text-slate-500 text-center">
                                        {valuesOfKeyName[key]}
                                    </h3>
                                    <div className="flex flex-wrap gap-1 justify-center ">
                                        {value.length > 0 ? (
                                            value.map(({ name, url, damageValue }) => {
                                                return (
                                                    <Type
                                                        type={name}
                                                        key={url}
                                                        damageValue={damageValue}
                                                    />
                                                )
                                            })
                                        ) : (
                                            <Type type={'none'} key={'none'} />
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                </>
            ) : <div></div>

            }

        </div>
    )
}

export default DamageRelations