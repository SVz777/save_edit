import { defineStore } from 'pinia'
import { reactive } from 'vue'
import * as _ from 'lodash'

class Game {
    data: { [key: string]: any } = {};
    parsed: boolean = false

    parse(data: string) {
        try {
            this.data = JSON.parse(data);
            this.parsed = true;
        } catch (error) {
            console.error('Parse error:', error);
            this.parsed = false;
        }
    }

    get(...path: any[]): any {
        return _.get(this.data, path);
    }

    set(value: any, ...path: any[]) {
        _.set(this.data, path, value);
    }
}

export const useGameStore = defineStore('house-of-legacy', () => {
    const game = reactive(new Game())
    return {
        game
    }
})
