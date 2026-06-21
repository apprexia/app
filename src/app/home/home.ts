import {
    AfterViewInit,
    Component,
    ElementRef,
    ViewChildren,
    QueryList,
    inject,
    PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.html',
    styleUrl: './home.scss',
    imports: [RouterLink],
})
export class Home implements AfterViewInit {
    private platformId = inject(PLATFORM_ID);

    @ViewChildren('slideRef')
    slides!: QueryList<ElementRef<HTMLElement>>;

    sections = [
        {
            label: 'Accueil',
            sublabel: 'Analysez avant d’investir',
        },
        {
            label: 'Problématique',
            sublabel: 'Le prix affiché n’est pas toujours le juste prix',
        },
        {
            label: 'Analyse & Décision',
            sublabel: 'Valeur, rentabilité et risques',
        },
        {
            label: 'Comment ça fonctionne',
            sublabel: 'La méthodologie Apprexia',
        },
        {
            label: 'Technologie',
            sublabel: 'Données, IA et intelligence marché',
        },
        {
            label: 'Indicateurs',
            sublabel: 'Les chiffres qui comptent',
        },
        {
            label: 'Tarifs',
            sublabel: 'Choisissez votre niveau d’analyse',
        },
    ];

    idx = 0;
    isAnimating = false;
    menuOpen = false;

    // 🔥 source de vérité
    get slidesCount(): number {
        return this.sections.length;
    }

    ngAfterViewInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        // active first slide
        const first = this.slides.first?.nativeElement;
        first?.classList.add('active');
    }

    go(target: number): void {
        if (
            this.isAnimating ||
            target === this.idx ||
            target < 0 ||
            target >= this.sections.length
        ) {
            return;
        }

        this.isAnimating = true;

        const currentIdx = this.idx;
        this.idx = target; // <-- MAJ immédiate

        const slidesArray = this.slides.toArray();

        const oldSlide = slidesArray[currentIdx]?.nativeElement;
        const nextSlide = slidesArray[target]?.nativeElement;

        oldSlide?.classList.remove('active');
        oldSlide?.classList.add('exiting');

        setTimeout(() => {
            nextSlide?.classList.add('active');
            this.isAnimating = false;
        }, 350);
    }

    next() {
        this.go(this.idx + 1);
    }

    prev() {
        this.go(this.idx - 1);
    }

    openMenu() {
        this.menuOpen = true;
    }

    toggleMenu(target?: number) {
        this.menuOpen = false;

        if (target !== undefined) {
            this.go(target);
        }
    }

    get currentSection(): string {
        return this.sections[this.idx].label ?? '';
    }

    get currentDisplay(): string {
        return String(this.idx + 1).padStart(2, '0');
    }

    get totalDisplay(): string {
        return String(this.sections.length).padStart(2, '0');
    }
}
