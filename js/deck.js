var deck = {
  cards: [{
      id: 1,
      suit: 'Land',
      title: '땅',
      name: '산',
      strength: 9,
      bonus: '<span class="weather">연기</span>와 <span class="flame">들불</span>이 모두 있으면 +50. <br />모든 <span class="flood">물</span>의 패널티 제거.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('연기') && hand.contains('들불') ? 50 : 0;
      },
      clearsPenalty: function(card) {
        return card.suit === 'Flood';
      },
      relatedSuits: ['Flood'],
      relatedCards: ['연기', '들불']
    },
    {
      id: 2,
      suit: 'Land',
      name: '동굴',
      strength: 6,
      bonus: '<span class="army">드워프 보병대</span>, <span class="beast">용</span> 중 하나라도 있으면 +25. <br />모든 <span class="weather">날씨</span>의 패널티 제거.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('드워프 보병대') || hand.contains('용') ? 25 : 0;
      },
      clearsPenalty: function(card) {
        return card.suit === 'Weather';
      },
      relatedSuits: ['Weather'],
      relatedCards: ['드워프 보병대', '용']
    },
    {
      id: 3,
      suit: 'Land',
      name: '종탑',
      strength: 8,
      bonus: '<span class="wizard">마법사</span>가 하나라도 있으면 +15.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit('Wizard') ? 15 : 0;
      },
      relatedSuits: ['Wizard'],
      relatedCards: []
    },
    {
      id: 4,
      suit: 'Land',
      name: '숲',
      strength: 7,
      bonus: '<span class="beast">야수</span> 1장동 +12. <span class="army">엘프 궁수대</span>가 있으면 +12.',
      penalty: null,
      bonusScore: function(hand) {
        return 12 * hand.countSuit('Beast') + (hand.contains('엘프 궁수대') ? 12 : 0);
      },
      relatedSuits: ['Beast'],
      relatedCards: ['엘프 궁수대']
    },
    {
      id: 5,
      suit: 'Land',
      name: '대지의 정령',
      strength: 4,
      bonus: '다른 <span class="land">땅</span> 1장당 +15.',
      penalty: null,
      bonusScore: function(hand) {
        return 15 * hand.countSuitExcluding('Land', this.id);
      },
      relatedSuits: ['Land'],
      relatedCards: []
    },
    {
      id: 6,
      suit: 'Flood',
      title: '물',
      name: '생명의 샘',
      strength: 1,
      bonus: '가지고 있는 <span class="weapon">무기</span>, <span class="flood">물</span>, <span class="flame">불</span>, <span class="land">땅</span> or <span class="weather">날씨</span> 중 1장의 기본 힘 더하기.',
      penalty: null,
      bonusScore: function(hand) {
        var max = 0;
        for (const card of hand.nonBlankedCards()) {
          if (card.suit === 'Weapon' || card.suit === 'Flood' || card.suit === 'Flame' || card.suit === 'Land' || card.suit === 'Weather') {
            if (card.strength > max) {
              max = card.strength;
            }
          }
        }
        return max;
      },
      relatedSuits: ['Weapon', 'Flood', 'Flame', 'Land', 'Weather'],
      relatedCards: []
    },
    {
      id: 7,
      suit: 'Flood',
      name: '늪',
      strength: 18,
      bonus: null,
      penalty: '<span class="army">군대</span>와 <span class="flame">불</span> 1장당 -3.',
      penaltyScore: function(hand) {
        var penaltyCards = hand.countSuit('Flame');
        if (!(hand.containsId(25) || hand.containsId(41))) { // these clear the word 'Army' from the penalty
          penaltyCards += hand.countSuit('Army');
        }
        return -3 * penaltyCards;
      },
      relatedSuits: ['Army', 'Flame'],
      relatedCards: []
    },
    {
      id: 8,
      suit: 'Flood',
      name: '대홍수',
      strength: 32,
      bonus: null,
      penalty: '모든 <span class="army">군대</span> 무효, 모든 <span class="land">땅</span> 무효 (<span class="land">산</span> 예외), 모든 <span class="flame">불</span> 무효 (<span class="flame">번개</span> 예외).',
      blanks: function(card, hand) {
        return (card.suit === 'Army' && !(hand.containsId(25) || hand.containsId(41))) || // these clear the word 'Army' from the penalty
          (card.suit === 'Land' && card.name !== '산') ||
          (card.suit === 'Flame' && card.name !== '번개');
      },
      relatedSuits: ['Army', 'Land', 'Flame'],
      relatedCards: ['산', '번개']
    },
    {
      id: 9,
      suit: 'Flood',
      name: '섬',
      strength: 14,
      bonus: '<span class="flood">물</span>이나 <span class="flame">불</span> 중 1장의 패널티를 제거.',
      penalty: null,
      action: '물이나 불 중 1장의 패널티를 제거.',
      relatedSuits: ['Flood', 'Flame'],
      relatedCards: []
    },
    {
      id: 10,
      suit: 'Flood',
      name: '물의 정령',
      strength: 4,
      bonus: '다른 <span class="flood">물</span> 1장당 +15.',
      penalty: null,
      bonusScore: function(hand) {
        return 15 * hand.countSuitExcluding('Flood', this.id);
      },
      relatedSuits: ['Flood'],
      relatedCards: []
    },
    {
      id: 11,
      suit: 'Weather',
      title: '날씨',
      name: '폭풍우',
      strength: 8,
      bonus: '<span class="flood">물</span> 1장당 +10.',
      penalty: '모든 <span class="flame">불</span> (<span class="flame">번개</span> 예외) 무효.',
      bonusScore: function(hand) {
        return 10 * hand.countSuit('Flood');
      },
      blanks: function(card, hand) {
        return card.suit === 'Flame' && card.name !== '번개';
      },
      relatedSuits: ['Flood', 'Flame'],
      relatedCards: ['번개']
    },
    {
      id: 12,
      suit: 'Weather',
      name: '눈보라',
      strength: 30,
      bonus: null,
      penalty: '모든 <span class="flood">물</span> 무효. <br /><span class="army">군대</span>, <span class="leader">지도자</span>, <span class="beast">야수</span>, <span class="flame">불</span> 1장당 -5.',
      penaltyScore: function(hand) {
        var penaltyCards = hand.countSuit('Leader') + hand.countSuit('Beast') + hand.countSuit('Flame');
        if (!hand.containsId(25)) { // clears the word 'Army' from the penalty
          penaltyCards += hand.countSuit('Army');
        }
        return -5 * penaltyCards;
      },
      blanks: function(card, hand) {
        return card.suit === 'Flood';
      },
      relatedSuits: ['Leader', 'Beast', 'Flame', 'Army', 'Flood'],
      relatedCards: []
    },
    {
      id: 13,
      suit: 'Weather',
      name: '연기',
      strength: 27,
      bonus: null,
      penalty: '<span class="flame">불</span>이 하나도 없으면 이 카드는 무효.',
      blankedIf: function(hand) {
        return !hand.containsSuit('Flame');
      },
      relatedSuits: ['Flame'],
      relatedCards: []
    },
    {
      id: 14,
      suit: 'Weather',
      name: '회오리바람',
      strength: 13,
      bonus: '<span class="weather">폭풍우</span>가 있고 <span class="weather">눈보라</span>, <span class="flood">대홍수</span> 중 하나라도 있으면 +40.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('폭풍우') && (hand.contains('눈보라') || hand.contains('대홍수')) ? 40 : 0;
      },
      relatedSuits: ['폭풍우'],
      relatedCards: ['눈보라', '대홍수']
    },
    {
      id: 15,
      suit: 'Weather',
      name: '대기의 정령',
      strength: 4,
      bonus: '다른 <span class="weather">날씨</span> 1장당 +15.',
      penalty: null,
      bonusScore: function(hand) {
        return 15 * hand.countSuitExcluding('Weather', this.id);
      },
      relatedSuits: ['Weather'],
      relatedCards: []
    },
    {
      id: 16,
      suit: 'Flame',
      title: '불',
      name: '들불',
      strength: 40,
      bonus: null,
      penalty: '모든 카드 무효. <span class="flame">불</span>, <span class="wizard">마법사</span>, <span class="weather">날씨</span>, <span class="weapon">무기</span>, <span class="artifact">유물</span>, <span class="land">산</span>, <span class="flood">대홍수</span>, <span class="flood">섬</span>, <span class="beast">유니콘</span>, <span class="beast">용</span> 예외.',
      blanks: function(card, hand) {
        return !(card.suit === 'Flame' || card.suit === 'Wizard' || card.suit === 'Weather' ||
          card.suit === 'Weapon' || card.suit === 'Artifact' || card.suit === 'Wild' || card.name === '산' ||
          card.name === '대홍수' || card.name === '섬' || card.name === '유니콘' || card.name === '용');
      },
      relatedSuits: allSuits(),
      relatedCards: ['산', '대홍수', '섬', '유니콘', '용']
    },
    {
      id: 17,
      suit: 'Flame',
      name: '양초',
      strength: 2,
      bonus: '<span class="artifact">변화의 책</span>과 <span class="land">종탑</span>이 모두 있고, <span class="wizard">마법사</span>가 하나라도 있으면 +100.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('변화의 책') && hand.contains('종탑') && hand.containsSuit('Wizard') ? 100 : 0;
      },
      relatedSuits: ['Wizard'],
      relatedCards: ['변화의 책', '종탑']
    },
    {
      id: 18,
      suit: 'Flame',
      name: '대장간',
      strength: 9,
      bonus: '<span class="weapon">무기</span>와 <span class="artifact">유물</span> 1장당 +9.',
      penalty: null,
      bonusScore: function(hand) {
        return 9 * (hand.countSuit('Weapon') + hand.countSuit('Artifact'));
      },
      relatedSuits: ['Weapon', 'Artifact'],
      relatedCards: []
    },
    {
      id: 19,
      suit: 'Flame',
      name: '번개',
      strength: 11,
      bonus: '<span class="weather">폭풍우</span>가 있으면 +30.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('폭풍우') ? 30 : 0;
      },
      relatedSuits: [],
      relatedCards: ['폭풍우']
    },
    {
      id: 20,
      suit: 'Flame',
      name: '불의 정령',
      strength: 4,
      bonus: '다른 <span class="flame">불</span> 1장당 +15.',
      penalty: null,
      bonusScore: function(hand) {
        return 15 * hand.countSuitExcluding('Flame', this.id);
      },
      relatedSuits: ['Flame'],
      relatedCards: []
    },
    {
      id: 21,
      suit: 'Army',
      title: '군대',
      name: '기사단',
      strength: 20,
      bonus: null,
      penalty: '<span class="leader">지도자</span>가 하나도 없으면 -8.',
      penaltyScore: function(hand) {
        return hand.containsSuit('Leader') ? 0 : -8;
      },
      relatedSuits: ['Leader'],
      relatedCards: []
    },
    {
      id: 22,
      suit: 'Army',
      name: '엘프 궁수대',
      strength: 10,
      bonus: '<span class="weather">날씨</span>가 하나도 없으면 +5.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit('Weather') ? 0 : 5;
      },
      relatedSuits: ['Weather'],
      relatedCards: []
    },
    {
      id: 23,
      suit: 'Army',
      name: '경기병대',
      strength: 17,
      bonus: null,
      penalty: '<span class="land">땅</span> 1장당 -2.',
      penaltyScore: function(hand) {
        return -2 * hand.countSuit('Land');
      },
      relatedSuits: ['Land'],
      relatedCards: []

    },
    {
      id: 24,
      suit: 'Army',
      name: '드워프 보병대',
      strength: 15,
      bonus: null,
      penalty: '다른 <span class="army">군대</span> 1장당 -2.',
      penaltyScore: function(hand) {
        if (!hand.containsId(25)) { // clears the word 'Army' from the penalty
          return -2 * hand.countSuitExcluding('Army', this.id);
        }
        return 0;
      },
      relatedSuits: ['Army'],
      relatedCards: []
    },
    {
      id: 25,
      suit: 'Army',
      name: '돌격대',
      strength: 5,
      bonus: '<span class="land">땅</span> 1장당 +10. <br />모든 카드의 페널티에서 <span class="army">군대</span>를 제거.',
      penalty: null,
      bonusScore: function(hand) {
        return 10 * hand.countSuit('Land');
      },
      relatedSuits: ['Land', 'Army'],
      relatedCards: []
    },
    {
      id: 26,
      suit: 'Wizard',
      title: '마법사',
      name: '수집가',
      strength: 7,
      bonus: '종류가 같고, 이름은 같지 않은 카드 3장당 +10, 4장 +40, 5장 +100.',
      penalty: null,
      bonusScore: function(hand) {
        var bySuit = {};
        for (const card of hand.nonBlankedCards()) {
          var suit = card.suit;
          if (bySuit[suit] === undefined) {
            bySuit[suit] = {};
          }
          bySuit[suit][card.name] = card;
        }
        var bonus = 0;
        for (const suit of Object.values(bySuit)) {
          var count = Object.keys(suit).length;
          if (count === 3) {
            bonus += 10;
          } else if (count === 4) {
            bonus += 40;
          } else if (count >= 5) {
            bonus += 100;
          }
        }
        return bonus;
      },
      relatedSuits: allSuits(),
      relatedCards: []
    },
    {
      id: 27,
      suit: 'Wizard',
      name: '야수 조련사',
      strength: 9,
      bonus: '<span class="beast">야수</span> 1장당 +9. <br />모든 <span class="beast">야수</span>의 패널티 제거.',
      penalty: null,
      bonusScore: function(hand) {
        return 9 * hand.countSuit('Beast');
      },
      clearsPenalty: function(card) {
        return card.suit === 'Beast';
      },
      relatedSuits: ['Beast'],
      relatedCards: []
    },
    {
      id: 28,
      suit: 'Wizard',
      name: '강령술사',
      strength: 3,
      bonus: '게임 종료 후 버려진 <span class="army">군대</span>, <span class="leader">지도자</span>, <span class="wizard">마법사</span>, <span class="beast">야수</span> 중 1장을 가져와서 8번째 카드로 계산 가능.',
      penalty: null,
      relatedSuits: ['Army', 'Leader', 'Wizard', 'Beast'],
      relatedCards: []
    },
    {
      id: 29,
      suit: 'Wizard',
      name: '대마도사',
      strength: 25,
      bonus: null,
      penalty: '<span class="leader">지도자</span>와 다른 <span class="wizard">마법사</span> 1장당 -10.',
      penaltyScore: function(hand) {
        return -10 * (hand.countSuit('Leader') + hand.countSuitExcluding('Wizard', this.id));
      },
      relatedSuits: ['Leader', 'Wizard'],
      relatedCards: []
    },
    {
      id: 30,
      suit: 'Wizard',
      name: '여마도사',
      strength: 5,
      bonus: '<span class="land">땅</span>, <span class="weather">날씨</span>, <span class="flood">물</span>, <span class="flame">불</span> 1장당 +5.',
      penalty: null,
      bonusScore: function(hand) {
        return 5 * (hand.countSuit('Land') + hand.countSuit('Weather') + hand.countSuit('Flood') + hand.countSuit('Flame'));
      },
      relatedSuits: ['Land', 'Weather', 'Flood', 'Flame'],
      relatedCards: []
    },
    {
      id: 31,
      suit: 'Leader',
      title: '지도자',
      name: '왕',
      strength: 8,
      bonus: '<span class="army">군대</span> 1장당 +5. <br />또는 <span class="leader">여왕</span>이 있으면, <span class="army">군대</span> 1장당 +20.',
      penalty: null,
      bonusScore: function(hand) {
        return (hand.contains('여왕') ? 20 : 5) * hand.countSuit('Army');
      },
      relatedSuits: ['Army'],
      relatedCards: ['여왕']
    },
    {
      id: 32,
      suit: 'Leader',
      name: '여왕',
      strength: 6,
      bonus: '<span class="army">군대</span> 1장당 +5. <br />또는 <span class="leader">왕</span>이 있으면, <span class="army">군대</span> 1장당 +20.',
      penalty: null,
      bonusScore: function(hand) {
        return (hand.contains('왕') ? 20 : 5) * hand.countSuit('Army');
      },
      relatedSuits: ['Army'],
      relatedCards: ['왕']
    },
    {
      id: 33,
      suit: 'Leader',
      name: '공주',
      strength: 2,
      bonus: '<span class="army">군대</span>, <span class="wizard">마법사</span>, 다른 <span class="leader">지도자</span> 1장당 +8.',
      penalty: null,
      bonusScore: function(hand) {
        return 8 * (hand.countSuit('Army') + hand.countSuit('Wizard') + hand.countSuitExcluding('Leader', this.id));
      },
      relatedSuits: ['Army', 'Wizard', 'Leader'],
      relatedCards: []
    },
    {
      id: 34,
      suit: 'Leader',
      name: '장군',
      strength: 4,
      bonus: '모든 <span class="army">군대</span>의 기본 힘의 합.',
      penalty: null,
      bonusScore: function(hand) {
        var total = 0;
        for (const card of hand.nonBlankedCards()) {
          if (card.suit === 'Army') {
            total += card.strength;
          }
        }
        return total;
      },
      relatedSuits: ['Army'],
      relatedCards: []
    },
    {
      id: 35,
      suit: 'Leader',
      name: '황후',
      strength: 15,
      bonus: '<span class="army">군대</span> 1장당 +10.',
      penalty: '다른 <span class="leader">지도자</span> 1장당 -5.',
      bonusScore: function(hand) {
        return 10 * hand.countSuit('Army');
      },
      penaltyScore: function(hand) {
        return -5 * hand.countSuitExcluding('Leader', this.id);
      },
      relatedSuits: ['Army', 'Leader'],
      relatedCards: []
    },
    {
      id: 36,
      suit: 'Beast',
      title: '야수',
      name: '유니콘',
      strength: 9,
      bonus: '<span class="leader">공주</span>가 있으면 +30. <br />또는 <span class="leader">황후</span>, <span class="leader">여왕</span>, <span class="leader">여마도사</span> 중 하나라도 있으면 +15.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('공주') ? 30 : (hand.contains('황후') || hand.contains('여왕') || hand.contains('여마도사')) ? 15 : 0;
      },
      relatedSuits: [],
      relatedCards: ['공주', '황후', '여왕', '여마도사']
    },
    {
      id: 37,
      suit: 'Beast',
      name: '바실리스크',
      strength: 35,
      bonus: null,
      penalty: '모든 <span class="army">군대</span>, 모든 <span class="leader">지도자</span>, 다른 모든 <span class="beast">야수</span> 무효.',
      blanks: function(card, hand) {
        return (card.suit === 'Army' && !hand.containsId(25)) || // clears the word 'Army' from the penalty
          card.suit === 'Leader' ||
          (card.suit === 'Beast' && card.id !== this.id);
      },
      relatedSuits: ['Army', 'Leader', 'Beast'],
      relatedCards: []
    },
    {
      id: 38,
      suit: 'Beast',
      name: '군마',
      strength: 6,
      bonus: '<span class="leader">지도자</span>나 <span class="wizard">마법사</span>가 하나라도 있으면 +14.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit('Leader') || hand.containsSuit('Wizard') ? 14 : 0;
      },
      relatedSuits: ['Leader', 'Wizard'],
      relatedCards: []
    },
    {
      id: 39,
      suit: 'Beast',
      name: '용',
      strength: 30,
      bonus: null,
      penalty: '<span class="wizard">마법사</span>가 하나도 없으면 -40.',
      penaltyScore: function(hand) {
        return hand.containsSuit('Wizard') ? 0 : -40;
      },
      relatedSuits: ['Wizard'],
      relatedCards: []
    },
    {
      id: 40,
      suit: 'Beast',
      name: '히드라',
      strength: 12,
      bonus: '<span class="flood">늪</span>이 있으면 +28.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('늪') ? 28 : 0;
      },
      relatedSuits: [],
      relatedCards: ['늪']
    },
    {
      id: 41,
      suit: 'Weapon',
      title: '무기',
      name: '전함',
      strength: 23,
      bonus: '모든 <span class="flood">물</span>의 페널티에서 <span class="army">군대</span>를 제거.',
      penalty: '<span class="flood">물</span>이 하나도 없으면 이 카드는 무효.',
      blankedIf: function(hand) {
        return !hand.containsSuit('Flood');
      },
      relatedSuits: ['Army', 'Flood'],
      relatedCards: []
    },
    {
      id: 42,
      suit: 'Weapon',
      name: '마법 지팡이',
      strength: 1,
      bonus: '<span class="wizard">마법사</span>가 하나라도 있으면 +25.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit('Wizard') ? 25 : 0;
      },
      relatedSuits: ['Wizard'],
      relatedCards: []
    },
    {
      id: 43,
      suit: 'Weapon',
      name: '케드의 검',
      strength: 7,
      bonus: '<span class="leader">지도자</span>가 하나라도 있으면 +10. <br />또는 <span class="leader">지도자</span>가 하나라도 있고, <span class="artifact">케드의 방패</span>가 있으면 +40.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit('Leader') ? (hand.contains('케드의 방패') ? 40 : 10) : 0;
      },
      relatedSuits: ['Leader'],
      relatedCards: ['케드의 방패']
    },
    {
      id: 44,
      suit: 'Weapon',
      name: '엘프의 장궁',
      strength: 3,
      bonus: '<span class="army">엘프 궁수대</span>, <span class="leader">장군</span>, <span class="wizard">야수 조련사</span> 중 하나라도 있으면 +30.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.contains('엘프 궁수대') || hand.contains('장군') || hand.contains('야수 조련사') ? 30 : 0;
      },
      relatedSuits: [],
      relatedCards: ['엘프 궁수대', '장군', '야수 조련사']
    },
    {
      id: 45,
      suit: 'Weapon',
      name: '전투 비행선',
      strength: 35,
      bonus: null,
      penalty: '<span class="army">군대</span>가 하나도 없거나, <span class="weather">날씨</span>가 하나라도 있으면 이 카드는 무효.',
      blankedIf: function(hand) {
        return !hand.containsSuit('Army') || hand.containsSuit('Weather');
      },
      relatedSuits: ['Army', 'Weather'],
      relatedCards: []
    },
    {
      id: 46,
      suit: 'Artifact',
      title: '유물',
      name: '케드의 방패',
      strength: 4,
      bonus: '<span class="leader">지도자</span>가 하나라도 있으면 +15. <br />또는 <span class="leader">지도자</span>가 하나라도 있고, <span class="weapon">케드의 검</span>이 있으면 +40.',
      penalty: null,
      bonusScore: function(hand) {
        return hand.containsSuit('Leader') ? (hand.contains('케드의 검') ? 40 : 15) : 0;
      },
      relatedSuits: ['Leader'],
      relatedCards: ['케드의 검']
    },
    {
      id: 47,
      suit: 'Artifact',
      name: '질서의 보석',
      strength: 5,
      bonus: '카드들 중 기본 힘이 연속된 숫자로 3장이면 +10, 4장이면 +30, 5장이면 +60, 6장이면 +100, 7장이면 +150.',
      penalty: null,
      bonusScore: function(hand) {
        var strengths = hand.nonBlankedCards().map(card => card.strength);
        var currentRun = 0;
        var runs = [];
        for (var i = 0; i <= 40; i++) {
          if (strengths.includes(i)) {
            currentRun++;
          } else {
            runs.push(currentRun);
            currentRun = 0;
          }
        }
        var bonus = 0;
        for (var run of runs) {
          if (run === 3) {
            bonus += 10;
          } else if (run === 4) {
            bonus += 30;
          } else if (run === 5) {
            bonus += 60;
          } else if (run === 6) {
            bonus += 100;
          } else if (run >= 7) {
            bonus += 150;
          }
        }
        return bonus;
      },
      relatedSuits: [],
      relatedCards: []
    },
    {
      id: 48,
      suit: 'Artifact',
      name: '세계수',
      strength: 2,
      bonus: '무효가 되지 않은 모든 카드들의 종류가 같지 않다면 +50.',
      penalty: null,
      bonusScore: function(hand) {
        var suits = [];
        for (const card of hand.nonBlankedCards()) {
          if (suits.includes(card.suit)) {
            return 0;
          }
          suits.push(card.suit);
        }
        return 50;
      },
      relatedSuits: allSuits(),
      relatedCards: []
    },
    {
      id: 49,
      suit: 'Artifact',
      name: '변화의 책',
      strength: 3,
      bonus: '손에 있는 다른 카드 1장의 종류를 변경 가능. </br>이름, 기본 힘, 보너스, 페널티는 그대로 유지.',
      penalty: null,
      action: '변화 시킬 카드를 손에서 고르시오.',
      relatedSuits: [], // empty because the main reason for relatedSuits is to determine how to use '변화의 책'
      relatedCards: []
    },
    {
      id: 50,
      suit: 'Artifact',
      name: '보호의 룬',
      strength: 1,
      bonus: '모든 카드의 페널티 제거',
      penalty: null,
      clearsPenalty: function(card) {
        return true;
      },
      relatedSuits: [],
      relatedCards: []
    },
    {
      id: 51,
      suit: 'Wild',
      title: '불명',
      name: '변신 능력자',
      strength: 0,
      bonus: '게임 전체의 <span class="artifact">유물</span>, <span class="leader">지도자</span>, <span class="wizard">마법사</span>, <span class="weapon">무기</span>, <span class="beast">야수</span> 중 1장의 이름과 종류를 복사 가능. <br />보너스, 페널티, 기본 힘은 복사 불가.',
      penalty: null,
      action: '복제할 카드를 고르시오.',
      relatedSuits: ['Artifact', 'Leader', 'Wizard', 'Weapon', 'Beast'].sort(),
      relatedCards: []
    },
    {
      id: 52,
      suit: 'Wild',
      name: '신기루',
      strength: 0,
      bonus: '게임 전체의 <span class="army">군대</span>, <span class="land">땅</span>, <span class="weather">날씨</span>, <span class="flood">물</span>, <span class="flame">불</span> 중 1장의 이름과 종류를 복사 가능. <br />보너스, 페널티, 기본 힘은 복사 불가',
      penalty: null,
      action: '복제할 카드를 고르시오',
      relatedSuits: ['Army', 'Land', 'Weather', 'Flood', 'Flame'].sort(),
      relatedCards: []
    },
    {
      id: 53,
      suit: 'Wild',
      name: '도플갱어',
      strength: 0,
      bonus: '손에 있는 다른 카드 1장의 이름, 종류, 기본 힘, 페널티를 복사 가능. <br />보너스는 복사 불가',
      penalty: null,
      action: '복제할 카드를 손에서 고르시오',
      relatedSuits: [],
      relatedCards: []
    },
    {
      id: 54,
      suit: 'Wizard',
      name: '광대',
      strength: 3,
      bonus: '(다른) 기본 힘이 홀수인 카드마다 +3. <br />또는 모든 카드의 기본 힘이 홀수면 +50.',
      penalty: null,
      bonusScore: function(hand) {
        var oddCount = 0;
        for (const card of hand.nonBlankedCards()) {
          if (card.strength % 2 === 1) {
            oddCount++;
          }
        }
        if (oddCount === hand.size()) {
          return 50;
        } else {
          return (oddCount - 1) * 3;
        }
      },
      relatedSuits: [],
      relatedCards: []
    }
  ],
  getCardByName: function(cardName) {
    for (const card of this.cards) {
      if (card.name === cardName) {
        return card;
      }
    }
  },
  getCardById: function(id) {
    return this.cards[id - 1];
  },
  getCardsBySuit: function(suits) {
    var cardsBySuit = {};
    for (const card of this.cards) {
      if (suits === undefined || suits.includes(card.suit)) {
        if (cardsBySuit[card.suit] === undefined) {
          cardsBySuit[card.suit] = [];
        }
        cardsBySuit[card.suit].push(card);
      }
    }
    var ordered = {};
    Object.keys(cardsBySuit).sort().forEach(function(key) {
      ordered[key] = cardsBySuit[key];
    });
    return ordered;
  }
};

function allSuits() {
  return ['Land', 'Flood', 'Weather', 'Flame', 'Army', 'Wizard', 'Leader', 'Beast', 'Weapon', 'Artifact', 'Wild'].sort();
}

var NONE = -1;
var ISLAND = 9;
var NECROMANCER = 28;
var BOOK_OF_CHANGES = 49;
var SHAPESHIFTER = 51;
var MIRAGE = 52;
var DOPPELGANGER = 53;

var ACTION_ORDER = [DOPPELGANGER, MIRAGE, SHAPESHIFTER, BOOK_OF_CHANGES, ISLAND];
