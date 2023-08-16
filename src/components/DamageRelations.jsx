import React, { useEffect, useState } from 'react'

const DamageRelations = ({damages}) => {

    const [damagePokemonForm, setDamagePokemonForm] = useState();

    useEffect(() => {

        const arrayDamage = damages.map((damage) =>
            separateObjectBetweenToAndFrom(damage))

        if (arrayDamage.length === 2) {  //속성이 두 개라면 
            // 합치는 부분
            const obj = joinDamageRelations(arrayDamage);
            setDamagePokemonForm(reduceDuplicateValues(postDamageValue(obj.from)))
        } else {  //속성이 한 개라면
            setDamagePokemonForm(postDamageValue(arrayDamage[0].from));
        }

    }, [damages])

    const joinDamageRelations = (props => {
        return {
            to: joinObjects(props, 'to'),
            from: joinObjects(props, 'from')
        }
    })

    
    const reduceDuplicateValues = (props) => {

        const duplicateValues = {
            double_damage: '4x',
            half_damage: '1/4x',
            no_damage: '0x'
        }

        return Object.entries(props)
            .reduce((acc, [keyName, value]) => {
                const key = keyName;
                // console.log([keyName, value]);

                const verifiedValue = filterForUniqueValues(
                    value,
                    duplicateValues[key]
                )

                return (acc = { [keyName]: verifiedValue, ...acc });
            }, {})
    }

    const filterForUniqueValues = (valueForFiltering, damageValue) => {


        return valueForFiltering.reduce((acc, currentValue) => {
            const { url, name } = currentValue;

            const filterACC = acc.filter((a) => a.name !== name);  //이름이 같으면 없애줌 =같지 않은것만 필터링

            return filterACC.length === acc.length
                ? (acc = [currentValue, ...acc])
                : (acc = [{ damageValue: damageValue, name, url }, ...filterACC])
        }, [])

    }

    const joinObjects = (props, string) => {

        const key = string;
        const firstArrayValue = props[0][key];
        const secondArrayValue = props[1][key];

        const result = Object.entries(secondArrayValue)
            .reduce((acc, [keyName, value]) => {
                // console.log(acc, [keyName, value]);
                const result = firstArrayValue[keyName].concat(value);

                return (acc = { [keyName]: result, ...acc })

            }, {})
        return result;

    }

    const postDamageValue = (props)  => {
        const result = Object.entries(props)
            .reduce((acc, [keyName, value]) => {

                const key = keyName;

                const valuesOfKeyName = {
                    double_damage: '2x',
                    half_damage: '1/2x',
                    no_damage: '0x'
                };


                return (acc = {
                    [keyName]: value.map(i => ({
                        damageValue: valuesOfKeyName[key], 
                        ...i  //최종적으로 {damageValue:값, name:값, url:값} 이렇게 나옴. 현재는 damageValue 값 하나만 나옴. 밑에 ...acc를 거쳐야 각 damageValue 값이 나옴 
                    })),
                    ...acc
                })
            }, {})

        return result;
    }
    
    const  separateObjectBetweenToAndFrom = (damage) =>{  //damage 데이터에서 from(영향을 받는 속성)과 to(영향을 주는 속성)을 나눠서 각각 변수에 담음
        const from = filterDamageRelations('_from',damage);
        console.log("from ", from)
        const to = filterDamageRelations('_to',damage);
        console.log("to ", to)
        return {from, to}
    }

    const filterDamageRelations = (valueFilter, damage) =>{
        //console.log("damage",damage);
        const result= Object.entries(damage)  //객체를 키, 값을 담은 배열로 반환 [[키, 값],[키, 값]]
            .filter(([keyName, value])=>{  
            return keyName.includes(valueFilter);   //keyName이 valueFilter(전달받은 to나 from)를 포함하고 있는것만 리턴 
            })
            .reduce((acc,[keyName, value])=>{  //reduce : acc인자값에  반환값을 누적함
                const keyWithValueFilterRemove = keyName.replace(valueFilter,'') //keyName 단어 안에서 _from이나 _to가 들어가있으면 없앰
                return (acc= {[keyWithValueFilterRemove]:value, ...acc}) // 출력 : [keyWithValueFilterRemove]의 값+':'+value값+ acc의 내부 요소들
            },{})
        return result;
    }

  return (
    <div>DamageRelations</div>
  )
}

export default DamageRelations